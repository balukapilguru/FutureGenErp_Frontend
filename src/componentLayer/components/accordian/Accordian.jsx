import React, { useState } from "react";
import thumbnail from "./../../../assets/images/thumbnail.svg";

const Accordian = ({
  modules = [],
  isShowButtons = false,
  onAddMedia,
  onEditMedia,
  onDeleteMedia,
}) => {
  const [openModule, setOpenModule] = useState(null);
  const [openTopic, setOpenTopic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const toggleModule = (id) => {
    setOpenModule(openModule === id ? null : id);
    setOpenTopic(null);
  };

  const toggleTopic = (id) => {
    setOpenTopic(openTopic === id ? null : id);
  };

  // const handlePreviewMedia = (media) => {
  //   if (media.assetType === "pdf") {
  //     setPreviewUrl(
  //       `https://teksacademy.s3.ap-south-1.amazonaws.com/${media.path}`
  //     );
  //   }
  // };

  const handlePreviewMedia = (media) => {
    const baseUrl = "https://teksacademy.s3.ap-south-1.amazonaws.com/";
    const fileUrl = `${baseUrl}${media.path}`;

    if (media.assetType === "pdf") {
      setPreviewUrl({
        type: "pdf",
        url: fileUrl,
      });
    } else if (media.assetType === "doc" || media.assetType === "docx") {
      setPreviewUrl({
        type: "doc",
        url: `https://docs.google.com/gview?url=${fileUrl}&embedded=true`,
      });
    } else if (media.assetType === "video") {
      setPreviewUrl({
        type: "video",
        url: fileUrl,
      });
    }
  };

  return (
    <>
      <div className="accordion">
        {modules.map((module, index) => (
          <div className="accordion-item mb-2" key={module.id}>
            {/* MODULE HEADER */}
            <h2 className="accordion-header">
              <button
                className={`accordion-button text-black ${
                  openModule === module.id ? "" : "collapsed"
                } shadow-none`}
                onClick={() => toggleModule(module.id)}
              >
                <span className="badge teks_orange_color me-1 px-2 py-1.5">
                  {index + 1}
                </span>
                {module.moduleName}
              </button>
            </h2>

            {/* MODULE BODY */}
            <div
              className={`accordion-collapse collapse ${
                openModule === module.id ? "show" : ""
              }`}
            >
              <div className="accordion-body bg-white">
                <div className="accordion">
                  {module.topics?.length > 0 ? (
                    module.topics.map((topic) => (
                      <div className="accordion-item mb-2" key={topic.id}>
                        {/* TOPIC HEADER */}
                        <h2 className="accordion-header">
                          <button
                            className={`accordion-button text-black ${
                              openTopic === topic.id ? "" : "collapsed"
                            } shadow-none`}
                            onClick={() => toggleTopic(topic.id)}
                          >
                            📙 {topic.topicName}
                          </button>
                        </h2>

                        {/* TOPIC BODY */}
                        <div
                          className={`accordion-collapse collapse ${
                            openTopic === topic.id ? "show" : ""
                          }`}
                        >
                          <div className="accordion-body bg-white">
                            {/* Header */}
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <div>
                                <h6 className="fw-bold mb-1">
                                  Media Resources
                                </h6>
                                <small className="text-secondary">
                                  {topic.topicMediaCollection?.length || 0}{" "}
                                  item(s)
                                </small>
                              </div>

                              {!isShowButtons && (
                                <button
                                  className="btn btn_primary px-4 shadow-sm"
                                  onClick={() => onAddMedia?.(topic, module)}
                                >
                                  <i className="bi bi-plus-lg me-2"></i>
                                  Add Media
                                </button>
                              )}
                            </div>

                            {/* MEDIA TABLE */}
                            {topic.topicMediaCollection?.length > 0 ? (
                              <div className="table-responsive">
                                <table className="table align-middle">
                                  <thead>
                                    <tr>
                                      <th style={{ width: "80px" }}>Preview</th>
                                      <th>Title</th>
                                      <th>Type</th>
                                      <th>Actions</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {topic.topicMediaCollection.map((media) => (
                                      <tr key={media.id}>
                                        {/* Thumbnail */}
                                        <td>
                                          <img
                                            loading="lazy"
                                            src={
                                              media.thumbnail
                                                ? `https://teksacademy.s3.ap-south-1.amazonaws.com/${media.thumbnail}`
                                                : thumbnail
                                            }
                                            width="40"
                                            height="40"
                                            className="rounded"
                                            style={{ objectFit: "cover" }}
                                            onError={(e) =>
                                              (e.target.src = thumbnail)
                                            }
                                          />
                                        </td>

                                        {/* Title */}
                                        <td>{media.title}</td>

                                        {/* Type */}
                                        <td>
                                          <span className="badge bg-secondary p-1.5 rounded-pill">
                                            {media.assetType?.toUpperCase()}
                                          </span>
                                        </td>

                                        {/* Actions */}
                                        <td>
                                          <div className="btn-group gap-2">
                                            <button
                                              className="btn btn-sm btn-outline-primary"
                                              onClick={() =>
                                                handlePreviewMedia(media)
                                              }
                                            >
                                              Preview
                                            </button>

                                            {!isShowButtons && (
                                              <>
                                                <button
                                                  className="btn btn-sm btn-outline-warning"
                                                  onClick={() =>
                                                    onEditMedia?.(
                                                      media,
                                                      topic,
                                                      module,
                                                    )
                                                  }
                                                >
                                                  Edit
                                                </button>

                                                <button
                                                  className="btn btn-sm btn-outline-danger"
                                                  onClick={() =>
                                                    onDeleteMedia?.(
                                                      media,
                                                      topic,
                                                      module,
                                                    )
                                                  }
                                                >
                                                  Delete
                                                </button>
                                              </>
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="text-center py-4">
                                <p className="text-secondary mb-0">
                                  No media linked to this topic
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-secondary text-center">
                      No topics in this module
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PDF PREVIEW MODAL */}
      {previewUrl && (
        <div
          className="modal show d-block bg-dark bg-opacity-50"
          onClick={() => setPreviewUrl(null)}
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Preview</h5>
                <button
                  className="btn-close"
                  onClick={() => setPreviewUrl(null)}
                ></button>
              </div>

              <div className="modal-body">
                {previewUrl?.type === "pdf" && (
                  <iframe
                    src={`${previewUrl.url}#toolbar=0&navpanes=0`}
                    width="100%"
                    height="550px"
                    title="PDF Preview"
                    loading="lazy"
                  />
                )}

                {previewUrl?.type === "doc" && (
                  <iframe
                    src={previewUrl.url}
                    width="100%"
                    height="550px"
                    loading="lazy"
                    title="DOC Preview"
                  />
                )}

                {previewUrl?.type === "video" && (
                  <video
                    src={previewUrl.url}
                    controls
                    autoPlay
                    muted
                    playsInline
                    width="100%"
                    style={{ maxHeight: "550px" }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Accordian;
