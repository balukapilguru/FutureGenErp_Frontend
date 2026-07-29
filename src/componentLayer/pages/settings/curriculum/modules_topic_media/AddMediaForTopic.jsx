import { useState, useEffect } from "react";
import { useFetcher, useLoaderData, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Accordian from "../../../../components/accordian/Accordian";
import defaultimage from "../../../../../../src/assets/images/thumbnail.svg";
import axios from "axios";
import { IoInformationCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import Select from "react-select";
import { ERPApi } from "../../../../../../src/serviceLayer/interceptor";

// S3 Base URL
const BASE_S3_URL = "https://teksacademy.s3.ap-south-1.amazonaws.com/";

const AddMediaForTopic = () => {
  const fetcher = useFetcher();
  // Get data from loader
  const { modules, error } = useLoaderData();
  const { curriculumId } = useParams();

  // --- STATES ---
  const [activeModal, setActiveModal] = useState(null);
  const [activeMedia, setActiveMedia] = useState(null);
  const [activeContext, setActiveContext] = useState({
    moduleId: null,
    topicId: null,
    curriculumId: curriculumId,
  });
  const [localModules, setLocalModules] = useState([]);

  // Form state for adding media
  const [addFormData, setAddFormData] = useState({
    title: "",
    description: "",
    assetType: "",
    isDownloadable: true,
    hasWatermark: false,
    path: "",
    thumbnail: "",
    mediaFile: null,
    thumbnailFile: null,
    status: "",
    uploadProgress: 0,
    thumbnailUploadProgress: 0,
    thumbnailStatus: "",
  });

  // Form state for editing media
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    assetType: "",
    isDownloadable: true,
    hasWatermark: false,
    thumbnail: "",
    thumbnailFile: null,
    thumbnailStatus: "",
    thumbnailUploadProgress: 0,
  });

  const [addFormErrors, setAddFormErrors] = useState({});
  const [editFormErrors, setEditFormErrors] = useState({});
  const [isThumbnailUploaded, setIsThumbnailUploaded] = useState(false);
  const [uploadThumbnailLoading, setUploadThumbnailLoading] = useState(false);
  const [isThumbnailMedia, setIsThumbnailMediaUploaded] = useState(false);
  const [isUpdatingEditMediaThumbnail, setIsUpdatingEditMediaThumbnail] =
    useState({
      loading: false,
      isUploaded: false,
      isFailed: false,
    });

  // Update local modules when loader data changes
  useEffect(() => {
    if (modules && modules.length > 0) {
      setLocalModules(modules);
    }
  }, [modules]);

  // --- API FUNCTIONS ---
  const getPreSignedUrl = async (assetType, file) => {
    try {
      const payload = {
        fileName: file.name,
        assetType: assetType,
      };

      const response = await ERPApi.post(
        "/batch/media/upload/pre-sign",
        payload,
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching pre-signed URL:", error);
      console.error("Error details:", error.response?.data || error.message);
      console.error("Error status:", error.response?.status);
      console.error("Error headers:", error.response?.headers);
      // toast.error(`Failed to get upload URL: ${error.response?.data?.message || error.message}`);
      throw error;
    }
  };

  const uploadFileToS3 = async (uploadURL, fileInput, onProgress) => {
    const file = fileInput?.fileObject || fileInput;

    try {
      const res = await axios.put(uploadURL, file, {
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            onProgress(percent);
          }
        },
      });

      return res.status === 200;
    } catch (error) {
      console.error("S3 upload error:", error);
      throw error;
    }
  };

  const uploadTopicMedia = async () => {
    const file = addFormData.mediaFile;
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    setAddFormData((prev) => ({
      ...prev,
      status: "uploading",
      uploadProgress: 0,
    }));

    try {
      const response = await getPreSignedUrl(addFormData.assetType, file);

      const uploadURL = response.uploadURL;
      const assetInfo = response.assetInfo;

      if (!uploadURL) {
        throw new Error("No upload URL received from server");
      }

      await uploadFileToS3(uploadURL, file, (progress) => {
        setAddFormData((prev) => ({
          ...prev,
          uploadProgress: progress,
        }));
      });

      // IMPORTANT: Set the path from assetInfo
      setAddFormData((prev) => ({
        ...prev,
        path: assetInfo.path, // This must match the path format in your payload
        status: "uploaded",
      }));

      toast.success("File uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload failed: " + (err.message || "Unknown error"));
      setAddFormData((prev) => ({
        ...prev,
        status: "error",
      }));
    }
  };

  const uploadThumbnail = async () => {
    setUploadThumbnailLoading(true);
    const file = addFormData.thumbnailFile;
    if (!file) {
      toast.warning("Please select a file first.");
      setUploadThumbnailLoading(false);
      return;
    }

    try {
      const response = await getPreSignedUrl("image", file);

      const uploadURL = response.uploadURL;
      const assetInfo = response.assetInfo;

      await uploadFileToS3(uploadURL, file, (progress) => {
        setAddFormData((prev) => ({
          ...prev,
          thumbnailUploadProgress: progress,
        }));
      });

      // IMPORTANT: Set the thumbnail from assetInfo
      setAddFormData((prev) => ({
        ...prev,
        thumbnail: assetInfo.path, // This must match the thumbnail path format in your payload
        thumbnailStatus: "uploaded",
      }));

      setIsThumbnailUploaded(true);
      setUploadThumbnailLoading(false);
      toast.success("Thumbnail uploaded successfully!");
    } catch (err) {
      console.error("Thumbnail upload error:", err);
      toast.error(
        "Thumbnail upload failed: " + (err.message || "Unknown error"),
      );
      setAddFormData((prev) => ({
        ...prev,
        thumbnailStatus: "error",
      }));
      setUploadThumbnailLoading(false);
    }
  };

  const uploadEditThumbnail = async () => {
    const file = editFormData.thumbnailFile;

    if (!file) {
      toast.warning("Please select a file first.");
      return;
    }

    // Add validation: only JPG or PNG under 1MB
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSizeMB = 1;

    if (!validTypes.includes(file.type)) {
      toast.warning(
        `Only JPG and PNG files are allowed. Current type: ${file.type}`,
      );
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.warning(
        `File size must be less than 1MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
      );
      return;
    }

    setIsUpdatingEditMediaThumbnail((prev) => ({ ...prev, loading: true }));

    try {
      // Call pre-signed URL API with the file object (not fileType separately)
      const response = await getPreSignedUrl("image", file);

      const uploadURL = response.uploadURL;
      const assetInfo = response.assetInfo;

      await uploadFileToS3(uploadURL, file, (progress) => {
        setEditFormData((prev) => ({
          ...prev,
          thumbnailUploadProgress: progress,
        }));
      });

      setEditFormData((prev) => ({
        ...prev,
        thumbnail: assetInfo.path,
        thumbnailStatus: "uploaded",
      }));

      setIsThumbnailMediaUploaded(true);
      setIsUpdatingEditMediaThumbnail((prev) => ({
        ...prev,
        loading: false,
        isUploaded: true,
        isFailed: false,
      }));
      toast.success("Thumbnail updated successfully!");
    } catch (err) {
      console.error("Edit thumbnail upload error:", err);
      console.error("Error details:", {
        message: err.message,
        stack: err.stack,
        response: err.response?.data,
      });
      toast.error("Upload failed: " + (err.message || "Unknown error"));
      setIsUpdatingEditMediaThumbnail((prev) => ({
        ...prev,
        loading: false,
        isFailed: true,
      }));
    }
  };

  // --- HANDLERS ---
  const closeModals = () => {
    setActiveModal(null);
    setActiveMedia(null);
    setIsThumbnailUploaded(false);
    setIsThumbnailMediaUploaded(false);
    setIsUpdatingEditMediaThumbnail({
      loading: false,
      isUploaded: false,
      isFailed: false,
    });
    setAddFormErrors({});
    setEditFormErrors({});

    // Reset form data
    setAddFormData({
      title: "",
      description: "",
      assetType: "",
      isDownloadable: true,
      hasWatermark: false,
      path: "",
      thumbnail: "",
      mediaFile: null,
      thumbnailFile: null,
      status: "",
      uploadProgress: 0,
      thumbnailUploadProgress: 0,
      thumbnailStatus: "",
    });

    setEditFormData({
      title: "",
      description: "",
      assetType: "",
      isDownloadable: true,
      hasWatermark: false,
      thumbnail: "",
      thumbnailFile: null,
      thumbnailStatus: "",
      thumbnailUploadProgress: 0,
    });
  };

  const validateAddFormData = () => {
    const errors = {};

    if (!addFormData.assetType || addFormData.assetType.trim() === "") {
      errors.assetType = "Media type is required";
    }

    if (!addFormData.title || addFormData.title.trim() === "") {
      errors.title = "Title is required";
    } else if (addFormData.title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters long";
    }

    if (!addFormData.mediaFile && addFormData.status !== "uploaded") {
      errors.mediaFile = "Media file is required";
    }

    setAddFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const errors = validateAddFormData();
    if (Object.keys(errors).length > 0) {
      return;
    }

    // Check if files are uploaded
    if (!addFormData.path && !addFormData.mediaFile) {
      toast.error("Please upload a media file first.");
      return;
    }

    if (!addFormData.thumbnail && !addFormData.thumbnailFile) {
      toast.error("Please upload a thumbnail first.");
      return;
    }

    // Check upload status
    if (addFormData.status !== "uploaded") {
      toast.error("Please wait for media file upload to complete.");
      return;
    }

    if (addFormData.thumbnailStatus !== "uploaded") {
      toast.error("Please wait for thumbnail upload to complete.");
      return;
    }

    // Prepare files array as per the required payload structure
    const files = [
      {
        title: addFormData.title,
        description: addFormData.description || "",
        assetType: addFormData.assetType,
        isDownloadable: addFormData.isDownloadable,
        hasWatermark: addFormData.hasWatermark,
        path: addFormData.path, // This should come from the upload response
        thumbnail: addFormData.thumbnail, // This should come from the thumbnail upload response
        fileSize: addFormData.mediaFile?.size
          ? (addFormData.mediaFile.size / 1024).toFixed(2)
          : null,
      },
    ];

    // Prepare the complete payload
    const payload = {
      curriculumId: activeContext.curriculumId,
      moduleId: activeContext.moduleId,
      topicId: activeContext.topicId,
      files: files,
    };

    const formData = new FormData();
    formData.set("payload", JSON.stringify(payload));
    formData.set("actionType", "addMedia");
    fetcher.submit(formData, {
      method: "POST",
      encType: "multipart/form-data",
    });
  };

  useEffect(() => {
    if (!fetcher.data) return;

    if (fetcher.data.type === "addMedia") {
      toast.success("Media added successfully!");

      resetAddForm();
      closeModals();
    }

    if (fetcher.data.type === "updateMedia") {
      toast.success("Media updated successfully!");

      closeModals();
    }

    if (fetcher.data.type === "deleteMedia") {
      toast.success("Media deleted successfully!");

      setLocalModules((prev) =>
        prev.map((module) => ({
          ...module,
          topics: module.topics?.map((topic) => ({
            ...topic,
            topicMediaCollection: topic.topicMediaCollection?.filter(
              (media) => media.id !== fetcher.data.data?.id,
            ),
          })),
        })),
      );
    }
  }, [fetcher.data]);

  // Add a reset function for the form
  const resetAddForm = () => {
    setAddFormData({
      title: "",
      description: "",
      assetType: "pdf",
      isDownloadable: true,
      hasWatermark: false,
      mediaFile: null,
      thumbnailFile: null,
      path: "",
      thumbnail: "",
      status: "idle",
      thumbnailStatus: "idle",
      uploadProgress: 0,
      thumbnailUploadProgress: 0,
    });
    setIsThumbnailUploaded(false);
  };

  const validateEditFormData = () => {
    const errors = {};

    if (!editFormData.title || editFormData.title.trim() === "") {
      errors.title = "Title is required.";
    } else if (editFormData.title.replace(/\s+/g, "").length < 3) {
      errors.title = "Title must be at least 3 characters.";
    }

    setEditFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateMedia = () => {
    if (!validateEditFormData()) return;

    const payload = {
      title: editFormData.title,
      description: editFormData.description,
      thumbnail: editFormData.thumbnail,
      assetType: editFormData.assetType,
      isDownloadable: editFormData.isDownloadable,
      hasWatermark: editFormData.hasWatermark,
    };

    const formData = new FormData();

    formData.set("actionType", "updateMedia");
    formData.set("curriculumId", activeContext.curriculumId);
    formData.set("mediaId", activeMedia.id);
    formData.set("payload", JSON.stringify(payload));

    fetcher.submit(formData, {
      method: "POST",
    });
  };

  // Accordion handlers
  const handleAddMedia = (topic, module) => {
    // Check if topic already has 3 or more media items
    const currentMediaCount = topic.topicMediaCollection?.length || 0;
    const MAX_MEDIA_PER_TOPIC = 3;

    if (currentMediaCount >= MAX_MEDIA_PER_TOPIC) {
      toast.warning(
        `Cannot add more media. Maximum ${MAX_MEDIA_PER_TOPIC} media items allowed per topic.`,
      );
      return;
    }

    setActiveContext({
      curriculumId: curriculumId,
      moduleId: module.id,
      topicId: topic.id,
    });
    setActiveModal("add");
    setIsThumbnailUploaded(false);
    setAddFormErrors({});
  };

  const handleEditMedia = (media, topic, module) => {
    setActiveMedia(media);
    setEditFormData({
      title: media.title || "",
      description: media.description || "",
      assetType: media.assetType || "",
      isDownloadable:
        media.isDownloadable !== undefined ? media.isDownloadable : true,
      hasWatermark: media.hasWatermark || false,
      thumbnail: media.thumbnail || "",
      thumbnailFile: null,
      thumbnailStatus: "",
      thumbnailUploadProgress: 0,
    });
    setActiveContext({
      curriculumId: curriculumId,
      moduleId: module.id,
      topicId: topic.id,
    });
    setActiveModal("edit");
    setIsThumbnailMediaUploaded(false);
    setIsUpdatingEditMediaThumbnail({
      loading: false,
      isUploaded: false,
      isFailed: false,
    });
    setEditFormErrors({});
  };

  const handlePreviewMedia = (media) => {
    setActiveMedia(media);
    setActiveModal("preview");
  };

  const handleDelete = (mediaId, topicId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();

        formData.set("actionType", "deleteMedia");
        formData.set("curriculumId", curriculumId);
        formData.set("mediaId", mediaId?.id);
        formData.set("topicId", topicId?.id);

        fetcher.submit(formData, {
          method: "POST",
        });
      }
    });
  };

  const getAcceptedFileType = (mediaType) => {
    switch (mediaType) {
      case "video":
        return "video/*";
      case "pdf":
        return "application/pdf";
      case "doc":
      case "docx":
        return ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      case "ppt":
        return ".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation";
      default:
        return "*";
    }
  };

  // Loading state
  if (!modules && !error) {
    return (
      <div className="min-vh-100 bg-light d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-vh-100 bg-light d-flex justify-content-center align-items-center">
        <div className="alert alert-danger m-3">
          <h4 className="alert-heading">Error Loading Data</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            Please try refreshing the page or contact support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {localModules && localModules.length > 0 ? (
        <div className="bg-white pt-3">
          <h1 className="text-center display-6.5 mt-5  fw-bold  mb-4">
            Curriculum
          </h1>
          <div className="container-fluid mt-7">
            <div className="card pt-2">
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <Accordian
                    modules={localModules || []}
                    onAddMedia={handleAddMedia}
                    onEditMedia={handleEditMedia}
                    onDeleteMedia={handleDelete}
                    onPreviewMedia={handlePreviewMedia}
                    showMediaActions={true}
                    multiple={true}
                    defaultExpanded={false}
                    baseImageUrl={BASE_S3_URL}
                    isShowButtons={false}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Add Media Modal */}
          {activeModal === "add" && (
            <div
              className="modal fade show"
              style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
              tabIndex="-1"
              role="dialog"
              aria-modal="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Add Media</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={closeModals}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleAddSubmit}>
                      {/* Media Type */}
                      <div className="mb-3">
                        <label className="form-label">
                          Media Type <span className="text-danger">*</span>
                        </label>
                        <Select
                          value={
                            addFormData.assetType
                              ? {
                                  value: addFormData.assetType,
                                  label:
                                    addFormData.assetType === "pdf"
                                      ? "PDF"
                                      : addFormData.assetType === "video"
                                        ? "Video"
                                        : addFormData.assetType === "doc"
                                          ? "DOC"
                                          : addFormData.assetType === "ppt"
                                            ? "PPT"
                                            : addFormData.assetType.toUpperCase(),
                                }
                              : null
                          }
                          onChange={(selectedOption) => {
                            const newValue = selectedOption
                              ? selectedOption.value
                              : "";
                            setAddFormData((prev) => ({
                              ...prev,
                              assetType: newValue,
                            }));
                            setAddFormErrors((prev) => ({
                              ...prev,
                              assetType: newValue
                                ? ""
                                : "Media type is required",
                            }));
                          }}
                          options={[
                            { value: "video", label: "Video" },
                            { value: "pdf", label: "PDF" },
                            { value: "doc", label: "DOC" },
                            { value: "ppt", label: "PPT" },
                          ]}
                          placeholder="Select Media Type"
                          className="react-select-container"
                          classNamePrefix="react-select"
                          styles={{
                            control: (base) => ({
                              ...base,
                              textAlign: "left",
                              paddingLeft: "8px",
                            }),
                            placeholder: (base) => ({
                              ...base,
                              textAlign: "left",
                              marginLeft: "6px",
                            }),
                            singleValue: (base) => ({
                              ...base,
                              textAlign: "left",
                              marginLeft: "5px",
                            }),
                            input: (base) => ({
                              ...base,
                              textAlign: "left",
                              marginLeft: "0",
                            }),
                            valueContainer: (base) => ({
                              ...base,
                              paddingLeft: "8px",
                              textAlign: "left",
                            }),
                          }}
                        />
                        {addFormErrors?.assetType && (
                          <div className="text-danger mt-1">
                            {addFormErrors.assetType}
                          </div>
                        )}
                      </div>

                      {/* Media Title */}
                      <div className="mb-3">
                        <label className="form-label">
                          Title <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Media Title"
                          value={addFormData.title}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            setAddFormData((prev) => ({
                              ...prev,
                              title: newValue,
                            }));
                            setAddFormErrors((prev) => ({
                              ...prev,
                              title: newValue ? "" : "Title is required",
                            }));
                          }}
                        />
                        {addFormErrors?.title && (
                          <div className="text-danger mt-1">
                            {addFormErrors.title}
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          placeholder="Enter Media Description"
                          rows="3"
                          value={addFormData.description}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            setAddFormData((prev) => ({
                              ...prev,
                              description: newValue,
                            }));
                          }}
                        />
                      </div>

                      {/* Thumbnail Upload */}
                      <div className="mb-3">
                        <label className="form-label">
                          Thumbnail{" "}
                          <IoInformationCircleOutline
                            size={18}
                            title="Thumbnail must be a JPG or PNG file under 1 MB."
                          />
                        </label>
                        <div className="d-flex gap-2">
                          <input
                            className="form-control"
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;

                              const validTypes = ["image/jpeg", "image/png"];
                              const maxSizeMB = 1;

                              if (!validTypes.includes(file.type)) {
                                toast.warning(
                                  "Only JPG and PNG files are allowed.",
                                );
                                e.target.value = "";
                                return;
                              }

                              if (file.size > maxSizeMB * 1024 * 1024) {
                                toast.warning(
                                  "File size must be less than 1MB.",
                                );
                                e.target.value = "";
                                return;
                              }

                              setAddFormData((prev) => ({
                                ...prev,
                                thumbnailFile: file,
                                thumbnailStatus: "",
                              }));
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn_primary"
                            onClick={uploadThumbnail}
                            disabled={
                              !addFormData.thumbnailFile ||
                              uploadThumbnailLoading ||
                              isThumbnailUploaded
                            }
                          >
                            {uploadThumbnailLoading ? "Uploading..." : "Upload"}
                          </button>
                        </div>
                        {uploadThumbnailLoading && !isThumbnailUploaded && (
                          <div
                            className="progress mt-2"
                            style={{ height: "8px" }}
                          >
                            <div
                              className="progress-bar progress-bar-striped progress-bar-animated bg-warning"
                              style={{
                                width: `${addFormData.thumbnailUploadProgress || 0}%`,
                              }}
                            />
                          </div>
                        )}
                        {isThumbnailUploaded && !uploadThumbnailLoading && (
                          <div className="text-success mt-1">✅ Uploaded</div>
                        )}
                        {addFormData.thumbnailStatus === "error" && (
                          <div className="text-danger mt-1">
                            ❌ Upload failed
                          </div>
                        )}
                      </div>

                      {/* Media File Upload */}
                      <div className="mb-3">
                        <label className="form-label">
                          Upload File <span className="text-danger">*</span>
                          <IoInformationCircleOutline
                            size={18}
                            title="Video Files must be under 500 MB. Other files under 5 MB."
                          />
                          {addFormData.assetType && (
                            <span
                              className="text-muted ms-2"
                              style={{ fontSize: "0.875rem" }}
                            >
                              {addFormData.assetType === "video"
                                ? "(Video: MP4, max 500MB)"
                                : `(${addFormData.assetType.toUpperCase()}, max 5MB)`}
                            </span>
                          )}
                        </label>

                        <div className="d-flex gap-2">
                          <input
                            type="file"
                            className="form-control"
                            disabled={!addFormData.assetType}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (!file) return;

                              const mediaType =
                                addFormData.assetType?.toLowerCase();

                              // Validation
                              if (mediaType === "video") {
                                const validType = "video/mp4";
                                const maxSizeMB = 500;
                                if (file.type !== validType) {
                                  setAddFormErrors((prev) => ({
                                    ...prev,
                                    mediaFile:
                                      "Only MP4 video files are allowed.",
                                  }));
                                  e.target.value = "";
                                  return;
                                }
                                if (file.size > maxSizeMB * 1024 * 1024) {
                                  setAddFormErrors((prev) => ({
                                    ...prev,
                                    mediaFile:
                                      "Video file size must be less than 500MB.",
                                  }));
                                  e.target.value = "";
                                  return;
                                }
                              } else {
                                const maxSizeMB = 5;
                                if (file.size > maxSizeMB * 1024 * 1024) {
                                  setAddFormErrors((prev) => ({
                                    ...prev,
                                    mediaFile: `File size must be less than ${maxSizeMB}MB.`,
                                  }));
                                  e.target.value = "";
                                  return;
                                }
                              }

                              setAddFormErrors((prev) => ({
                                ...prev,
                                mediaFile: "",
                              }));
                              setAddFormData((prev) => ({
                                ...prev,
                                mediaFile: file,
                                status: "",
                                uploadProgress: 0,
                              }));
                            }}
                            accept={getAcceptedFileType(addFormData.assetType)}
                          />
                          <button
                            type="button"
                            className="btn btn_curroprimary"
                            onClick={uploadTopicMedia}
                            disabled={
                              !addFormData.mediaFile ||
                              addFormData.status === "uploading" ||
                              addFormData.status === "uploaded"
                            }
                          >
                            {addFormData.status === "uploading"
                              ? "Uploading..."
                              : "Upload"}
                          </button>
                        </div>
                        {addFormErrors?.mediaFile && (
                          <div className="text-danger mt-1">
                            {addFormErrors.mediaFile}
                          </div>
                        )}
                        {addFormData.status === "uploading" && (
                          <div
                            className="progress mt-2"
                            style={{ height: "8px" }}
                          >
                            <div
                              className="progress-bar progress-bar-striped progress-bar-animated bg-warning"
                              style={{
                                width: `${addFormData.uploadProgress || 0}%`,
                              }}
                            />
                          </div>
                        )}
                        {addFormData.status === "uploaded" && (
                          <div className="text-success mt-1">
                            ✅ File uploaded
                          </div>
                        )}
                        {addFormData.status === "error" && (
                          <div className="text-danger mt-1">
                            ❌ Upload failed
                          </div>
                        )}
                      </div>

                      <div className="modal-footer px-0 pb-0">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={closeModals}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn_primary"
                          disabled={addFormData.status !== "uploaded" || fetcher.state=="submitting"|| fetcher.state=="loading"}
                        >
                           {(fetcher.state=="submitting"|| fetcher.state=="loading") ? "Submitting..":"Submit"}
                          
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Media Modal */}
          {activeModal === "edit" && activeMedia && (
            <div
              className="modal fade show"
              style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
              tabIndex="-1"
              role="dialog"
              aria-modal="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Media</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={closeModals}
                    ></button>
                  </div>
                  <div className="modal-body">
                    {/* Media Title */}
                    <div className="mb-3">
                      <label className="form-label">
                        Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Media Title"
                        value={editFormData.title}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setEditFormData((prev) => ({
                            ...prev,
                            title: newValue,
                          }));
                          setEditFormErrors((prev) => ({
                            ...prev,
                            title: newValue ? "" : "Title is required",
                          }));
                        }}
                      />
                      {editFormErrors?.title && (
                        <div className="text-danger mt-1">
                          {editFormErrors.title}
                        </div>
                      )}
                    </div>

                    {/* Thumbnail */}
                    <div className="mb-3">
                      <label className="form-label">
                        Thumbnail{" "}
                        <IoInformationCircleOutline
                          size={18}
                          title="Thumbnail must be a JPG or PNG file under 1 MB."
                        />
                      </label>

                      {/* Current Thumbnail Preview */}
                      {editFormData.thumbnail && !isThumbnailMedia && (
                        <div className="mb-2">
                          <img
                            src={
                              editFormData.thumbnail?.startsWith("http")
                                ? editFormData.thumbnail
                                : `${BASE_S3_URL}${editFormData.thumbnail}`
                            }
                            alt="thumbnail"
                            style={{ height: "80px", objectFit: "cover" }}
                            className="border rounded"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = defaultimage;
                            }}
                          />
                        </div>
                      )}

                      <div className="d-flex gap-2">
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          className="form-control"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const validTypes = ["image/jpeg", "image/png"];
                            const maxSizeMB = 1;

                            if (!validTypes.includes(file.type)) {
                              toast.warning(
                                "Only JPG and PNG files are allowed.",
                              );
                              e.target.value = "";
                              return;
                            }
                            if (file.size > maxSizeMB * 1024 * 1024) {
                              toast.warning("File size must be less than 1MB.");
                              e.target.value = "";
                              return;
                            }
                            setIsThumbnailMediaUploaded(true);
                            setEditFormData((prev) => ({
                              ...prev,
                              thumbnailFile: file,
                              thumbnailStatus: "",
                            }));
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn_primary"
                          onClick={uploadEditThumbnail}
                          disabled={
                            !editFormData.thumbnailFile ||
                            isUpdatingEditMediaThumbnail.loading
                          }
                        >
                          {isUpdatingEditMediaThumbnail.loading
                            ? "Uploading..."
                            : "Upload"}
                        </button>
                      </div>

                      {isUpdatingEditMediaThumbnail.loading &&
                        !isUpdatingEditMediaThumbnail.isFailed && (
                          <div
                            className="progress mt-2"
                            style={{ height: "8px" }}
                          >
                            <div
                              className="progress-bar progress-bar-striped progress-bar-animated bg-warning"
                              style={{
                                width: `${editFormData.thumbnailUploadProgress || 0}%`,
                              }}
                            />
                          </div>
                        )}
                      {!isUpdatingEditMediaThumbnail.loading &&
                        isUpdatingEditMediaThumbnail.isUploaded && (
                          <div className="text-success mt-1">
                            ✅ Thumbnail updated
                          </div>
                        )}
                      {isUpdatingEditMediaThumbnail.isFailed && (
                        <div className="text-danger mt-1">❌ Upload failed</div>
                      )}
                    </div>

                    <div className="modal-footer px-0 pb-0">
                      <button
                        className="btn btn-secondary"
                        onClick={closeModals}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn_primary"
                        onClick={handleUpdateMedia}
                        disabled={isUpdatingEditMediaThumbnail.loading || fetcher.state=="submitting"|| fetcher.state=="loading"}
                      >
                        {(fetcher.state=="submitting"|| fetcher.state=="loading") ? "Updating...":"Update"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preview Modal */}
          {activeModal === "preview" && activeMedia && (
            <div
              className="modal fade show"
              style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
              tabIndex="-1"
              role="dialog"
              aria-modal="true"
            >
              <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{activeMedia?.title || ""}</h5>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={closeModals}
                    ></button>
                  </div>
                  <div className="modal-body p-0" style={{ height: "70vh" }}>
                    {activeMedia.assetType?.toLowerCase() === "video" ? (
                      <video
                        controls
                        className="w-100 h-100"
                        src={`${BASE_S3_URL}${activeMedia.path}`}
                        controlsList="nodownload"
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : activeMedia.assetType?.toLowerCase() === "pdf" ? (
                      <iframe
                        src={`https://docs.google.com/gview?url=${encodeURIComponent(BASE_S3_URL + activeMedia.path)}&embedded=true`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        title={activeMedia.title}
                      />
                    ) : (
                      <iframe
                        src={`${BASE_S3_URL}${activeMedia.path}`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        title={activeMedia.title}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-5">
          <h3>No modules found</h3>
          <p className="text-muted">
            There are no modules available for this curriculum.
          </p>
        </div>
      )}
    </>
  );
};

export default AddMediaForTopic;
