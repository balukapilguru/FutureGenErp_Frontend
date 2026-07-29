import React, { useState, useEffect, useRef } from "react";
import { useLoaderData, useLocation, useParams } from "react-router-dom";
import io from "socket.io-client";
import Swal from "sweetalert2"; // Imported SweetAlert2
import BackButton from "../../../components/backbutton/BackButton";
import { useAuthContext } from "../../../../dataLayer/hooks/useAuthContext";
import { ERPApi } from "../../../../serviceLayer/interceptor";
import { ImAttachment } from "react-icons/im";
import { IoSendSharp, IoTicketOutline } from "react-icons/io5";
import { MdAutoGraph, MdOutlineSubject } from "react-icons/md";
import { AiOutlineMessage } from "react-icons/ai";

const SOCKET_SERVER_URL = import.meta.env.VITE_API_URL;
const socket = io(SOCKET_SERVER_URL);

export const ticketDataLoaderById = async ({ params }) => {
    const id = params.id;
    try {
        const response = await ERPApi.get(`/ticket/byId/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching ticket data:", error);
        return null;
    }
};

const TicketsView = () => {
    const location = useLocation();
    const unreadMessageIds = location.state?.unreadMessageIds || [];
    const chatBoxRef = useRef(null);
    const ticketData = useLoaderData();
    const { AuthState } = useAuthContext();
    const { id: ticketId } = useParams();
    const userId = AuthState?.user?.id;
    const senderRole = "Support";
    const [messages, setMessages] = useState(ticketData?.messages || []);
    const [selectedFile, setSelectedFile] = useState(null);
    const [text, setText] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (!ticketId) return;

        const handleMessageCreated = (message) => {
            console.log("Received:", message.id, message.message);

            setMessages((prev) => {
                const exists = prev.some((msg) => msg.id === message.id);

                if (exists) {
                    console.log("Duplicate ignored:", message.id);
                    return prev;
                }

                return [...prev, message];
            });
        };

        socket.off("messageCreated", handleMessageCreated);
        socket.on("messageCreated", handleMessageCreated);

        return () => {
            socket.off("messageCreated", handleMessageCreated);
        };
    }, [ticketId]);

    useEffect(() => {
        if (ticketId && unreadMessageIds.length > 0) {
            socket.emit("messageRead", { messageIds: unreadMessageIds });
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    unreadMessageIds.includes(msg.id) ? { ...msg, isRead: 1 } : msg
                )
            );
        }
    }, [ticketId, unreadMessageIds]);

    const sendMessage = async () => {
        if (!text.trim() && !selectedFile) return;
        if (isUploading) return;

        let payload = {
            ticketId,
            message: text,
            supportId: userId,
            senderRole,
            senderId: null,
            createdAt: new Date().toISOString(),
        };

        try {
            if (selectedFile) {
                setIsUploading(true);
                const formData = new FormData();
                formData.append("chat_file", selectedFile);

                const uploadResponse = await ERPApi.post(
                    "/ticket/upload-file",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (uploadResponse.data && uploadResponse.data.success) {
                    const uploadedData = uploadResponse.data.data;
                    payload.fileUrl = uploadedData.fileUrl;
                    payload.fileName = uploadedData.fileName;
                    payload.fileType = uploadedData.fileType;
                } else {
                    // Replaced alert with Swal
                    Swal.fire({
                        icon: "error",
                        title: "Upload Failed",
                        text: "Failed to upload attachment. Message not sent.",
                        confirmButtonColor: "#405189"
                    });
                    setIsUploading(false);
                    return;
                }
            }

            socket.emit("message", payload);
            setText("");
            setSelectedFile(null);
        } catch (error) {
            console.error("Error processing message dispatch:", error);
            // Replaced alert with Swal
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "An error occurred while sending the message.",
                confirmButtonColor: "#405189"
            });
        } finally {
            setIsUploading(false);
        }
    };

    const formatTime = (timestamp) => {
        return new Intl.DateTimeFormat("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }).format(new Date(timestamp));
    };

    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (imgSrc, chatImg = false) => {
        setSelectedImage(
            `https://teksacademy.s3.ap-south-1.amazonaws.com/support/ticket/${
                chatImg ? imgSrc : ticketData?.ticket_screenshot
            }`
        );
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setSelectedImage(null);
    };

    useEffect(() => {
        if (!ticketId || !userId) return;
        const roomName = `ticket_${ticketId}`;
        socket.emit("joinRoom", { ticketId, roomName, senderId: userId, senderRole });
        return () => {
            socket.emit("leaveRoom", { roomName });
        };
    }, [ticketId, userId]);

    const handleInput = (e) => {
        setText(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
    };

    /* ── status badge helper ── */
    const statusColor = {
        Open: { bg: "#dcfce7", color: "#166534" },
        Resolved: { bg: "#fee2e2", color: "#991b1b" },
        Pending: { bg: "#fef9c3", color: "#854d0e" },
    };
    const badge = statusColor[ticketData?.status] || { bg: "#f3f4f6", color: "#374151" };

    const getDateLabel = (date) => {
        const messageDate = new Date(date);

        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (messageDate.toDateString() === today.toDateString()) {
            return "Today";
        }

        if (messageDate.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        }

        return messageDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const MAX_SIZE = 50 * 1024 * 1024; // 50 MB

        if (file.size > MAX_SIZE) {
            // Replaced alert with Swal
            Swal.fire({
                icon: "warning",
                title: "File Too Large",
                text: "File size exceeds the maximum 50MB limit.",
                confirmButtonColor: "#405189"
            });
            e.target.value = ""; 
            return;
        }

        setSelectedFile(file);
    };

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div>
            <BackButton heading="Ticket Details" content="Back" to="/" />

            <div className="container mt-3">
                <div className="row mt-3 g-3">
                    {/* ── LEFT PANEL ── */}
                    <div className="col-md-4">
                        <div className="ticket-panel">
                            {/* Fixed Header */}
                            <div
                                style={{
                                    background: "#405189",
                                    padding: "18px 20px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "14px",
                                    flexShrink: 0,
                                }}
                            >
                                <div
                                    style={{
                                        width: "46px",
                                        height: "46px",
                                        borderRadius: "50%",
                                        background: "rgba(255,255,255,0.2)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "20px",
                                        fontWeight: "700",
                                        color: "#fff",
                                        flexShrink: 0,
                                    }}
                                >
                                    {ticketData?.student_detail?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <div
                                        style={{
                                            fontWeight: "600",
                                            fontSize: "15px",
                                            color: "#fff",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {ticketData?.student_detail?.name}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "12px",
                                            color: "rgba(255,255,255,0.75)",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {ticketData?.student_detail?.email}
                                    </div>
                                </div>
                            </div>

                            {/* Scrollable Body */}
                            <div className="ticket-panel-body">
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div
                                        style={{
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "8px",
                                            background: "#eff1f8",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <IoTicketOutline />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "500" }}>
                                            TICKET NO
                                        </div>
                                        <div style={{ fontSize: "14px", color: "#111827", fontWeight: "600" }}>
                                            {ticketData?.ticketNumber}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div
                                        style={{
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "8px",
                                            background: "#eff1f8",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <MdAutoGraph />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "500" }}>
                                            STATUS
                                        </div>
                                        <span
                                            style={{
                                                display: "inline-block",
                                                padding: "2px 10px",
                                                borderRadius: "20px",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                background: badge.bg,
                                                color: badge.color,
                                            }}
                                        >
                                            {ticketData?.status}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                                    <div
                                        style={{
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "8px",
                                            background: "#eff1f8",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <MdOutlineSubject />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "500" }}>
                                            SUBJECT
                                        </div>
                                        <div style={{ fontSize: "14px", color: "#111827" }}>{ticketData?.title}</div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                                    <div
                                        style={{
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "8px",
                                            background: "#eff1f8",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <AiOutlineMessage />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "500" }}>
                                            DESCRIPTION
                                        </div>
                                        <div style={{ fontSize: "13px", color: "#6b7280", lineHeight: "1.5" }}>
                                            {ticketData?.description}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div
                                        style={{
                                            fontSize: "11px",
                                            color: "#9ca3af",
                                            fontWeight: "500",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        SCREENSHOT
                                    </div>
                                    {ticketData?.ticket_screenshot !== "" ? (
                                        <div style={{ position: "relative" }}>
                                            <img
                                                src={`https://teksacademy.s3.ap-south-1.amazonaws.com/support/ticket/${ticketData?.ticket_screenshot}`}
                                                onClick={handleImageClick}
                                                alt="Ticket screenshot"
                                                style={{
                                                    width: "100%",
                                                    height: "160px",
                                                    objectFit: "cover",
                                                    borderRadius: "10px",
                                                    border: "1px solid #e5e7eb",
                                                    cursor: "zoom-in",
                                                    display: "block",
                                                }}
                                            />
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    inset: 0,
                                                    borderRadius: "10px",
                                                    background: "rgba(0,0,0,0)",
                                                    transition: "background 0.2s",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                                onMouseEnter={(e) =>
                                                    (e.currentTarget.style.background = "rgba(0,0,0,0.25)")
                                                }
                                                onMouseLeave={(e) =>
                                                    (e.currentTarget.style.background = "rgba(0,0,0,0)")
                                                }
                                                onClick={handleImageClick}
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            style={{
                                                height: "80px",
                                                borderRadius: "10px",
                                                border: "1px dashed #d1d5db",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#9ca3af",
                                                fontSize: "13px",
                                                gap: "6px",
                                            }}
                                        >
                                            <i className="bi bi-image" style={{ fontSize: "18px" }}></i>
                                            No screenshot uploaded
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT PANEL — CHAT ── */}
                    <div className="col-md-8">
                        <div className="chat-panel">
                            <div
                                style={{
                                    padding: "14px 20px",
                                    borderBottom: "1px solid #e5e7eb",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    background: "#fff",
                                    flexShrink: 0,
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div
                                        style={{
                                            width: "36px",
                                            height: "36px",
                                            borderRadius: "50%",
                                            background: "#405189",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            color: "#fff",
                                        }}
                                    >
                                        {ticketData?.student_detail?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div
                                            style={{ fontWeight: "600", fontSize: "14px", color: "#111827" }}
                                        >
                                            {ticketData?.student_detail?.name}
                                        </div>
                                        <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                                            #{ticketData?.ticketNumber}
                                        </div>
                                    </div>
                                </div>
                                <span
                                    style={{
                                        padding: "4px 12px",
                                        borderRadius: "20px",
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        background: badge.bg,
                                        color: badge.color,
                                    }}
                                >
                                    {ticketData?.status}
                                </span>
                            </div>

                            <div className="chat-messages" ref={chatBoxRef}>
                                {messages.length > 0 ? (
                                    messages.map((msg, index) => {
                                        const currentDate = getDateLabel(msg.createdAt);
                                        const previousDate =
                                            index > 0
                                                ? getDateLabel(messages[index - 1].createdAt)
                                                : "";
                                        const showDate = currentDate !== previousDate;

                                        return (
                                            <div key={index}>
                                                {showDate && (
                                                    <div className="chat-date-divider">
                                                        <span>{currentDate}</span>
                                                    </div>
                                                )}

                                                <div
                                                    className={`chat-row ${
                                                        msg.senderRole !== "Student"
                                                            ? "chat-right"
                                                            : "chat-left"
                                                    }`}
                                                >
                                                    <div
                                                        className={`chat-bubble ${
                                                            msg.senderRole !== "Student"
                                                                ? "bubble-student"
                                                                : "bubble-support"
                                                        }`}
                                                    >
                                                        {msg.message}

                                                        {msg.imageUrl &&
                                                            (() => {
                                                                const extension = msg.imageUrl
                                                                    ?.split(".")
                                                                    .pop()
                                                                    ?.toLowerCase();
                                                                const fileUrl = `https://teksacademy.s3.ap-south-1.amazonaws.com/support/ticket/${msg.imageUrl}`;
                                                                const fileName =
                                                                    msg.imageUrl.split("/").pop() ||
                                                                    msg.imageUrl;
                                                                const isStudent =
                                                                    msg.senderRole !== "Student";

                                                                if (
                                                                    [
                                                                        "jpg",
                                                                        "jpeg",
                                                                        "png",
                                                                        "gif",
                                                                        "webp",
                                                                    ].includes(extension)
                                                                ) {
                                                                    return (
                                                                        <img
                                                                            src={fileUrl}
                                                                            alt="attachment"
                                                                            className="bubble-image"
                                                                            onClick={() =>
                                                                                handleImageClick(
                                                                                    msg.imageUrl,
                                                                                    true
                                                                                )
                                                                            }
                                                                            style={{
                                                                                cursor: "zoom-in",
                                                                            }}
                                                                        />
                                                                    );
                                                                }

                                                                if (extension === "pdf") {
                                                                    return (
                                                                        <a
                                                                            href={fileUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className={`bubble-pdf-link ${
                                                                                isStudent
                                                                                    ? "bubble-pdf-student"
                                                                                    : "bubble-pdf-support"
                                                                            }`}
                                                                        >
                                                                            <div className="bubble-pdf-icon">
                                                                                PDF
                                                                            </div>
                                                                            <div className="bubble-pdf-info">
                                                                                <span className="bubble-pdf-name">
                                                                                    {fileName}
                                                                                </span>
                                                                                <span className="bubble-pdf-meta">
                                                                                    PDF · Tap to open
                                                                                </span>
                                                                            </div>
                                                                        </a>
                                                                    );
                                                                }

                                                                return (
                                                                    <a
                                                                        href={fileUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className={`bubble-pdf-link ${
                                                                            isStudent
                                                                                ? "bubble-pdf-student"
                                                                                : "bubble-pdf-support"
                                                                        }`}
                                                                    >
                                                                        <div className="bubble-pdf-icon">
                                                                            FILE
                                                                        </div>
                                                                        <div className="bubble-pdf-info">
                                                                            <span className="bubble-pdf-name">
                                                                                {fileName}
                                                                            </span>
                                                                            <span className="bubble-pdf-meta">
                                                                                {extension?.toUpperCase()} ·
                                                                                Tap to download
                                                                            </span>
                                                                        </div>
                                                                    </a>
                                                                );
                                                            })()}
                                                    </div>

                                                    <small className="chat-time">
                                                        {formatTime(msg.createdAt)}
                                                    </small>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div
                                        style={{
                                            flex: 1,
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#9ca3af",
                                            gap: "10px",
                                            height: "100%",
                                        }}
                                    >
                                        <i
                                            className="bi bi-chat-dots"
                                            style={{ fontSize: "36px", color: "#d1d5db" }}
                                        ></i>
                                        <span style={{ fontSize: "14px" }}>
                                            No messages yet. Start the conversation!
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Input — fixed at bottom, never scrolls */}
                            <div className="chat-input-wrapper" style={{ flexShrink: 0 }}>
                                {selectedFile && (
                                    <div className="chat-file-preview">
                                        {selectedFile.type.startsWith("image/") ? (
                                            <img
                                                src={URL.createObjectURL(selectedFile)}
                                                alt="preview"
                                                className="chat-file-preview-thumb"
                                            />
                                        ) : (
                                            <div className="chat-file-preview-icon">
                                                {selectedFile.type === "application/pdf"
                                                    ? "📄"
                                                    : "📎"}
                                            </div>
                                        )}
                                        <div className="chat-file-preview-info">
                                            <div className="chat-file-preview-name">
                                                {selectedFile.name}
                                            </div>
                                            <div className="chat-file-preview-size">
                                                {selectedFile.size < 1048576
                                                    ? (selectedFile.size / 1024).toFixed(1) + " KB"
                                                    : (selectedFile.size / 1048576).toFixed(1) +
                                                      " MB"}
                                            </div>
                                        </div>
                                        <button
                                            className="chat-file-preview-remove"
                                            onClick={() => setSelectedFile(null)}
                                            title="Remove"
                                            disabled={isUploading}
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}

                                <div className="chat-input-row">
                                    <textarea
                                        className="chat-input"
                                        placeholder={isUploading ? "Uploading file..." : "Type a message..."}
                                        value={text}
                                        rows={1}
                                        onChange={handleInput}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                sendMessage();
                                            }
                                        }}
                                        disabled={ticketData?.status === "Resolved" || isUploading}
                                    />
                                    <input
                                        type="file"
                                        hidden
                                        id="supportFileInput"
                                        onChange={handleFileChange}
                                        disabled={isUploading}
                                    />
                                    <button
                                        type="button"
                                        className="chat-attach-btn"
                                        onClick={() => document.getElementById("supportFileInput").click()}
                                        disabled={ticketData?.status === "Resolved" || isUploading}
                                        title="Attach file"
                                    >
                                        <ImAttachment />
                                    </button>
                                    <button
                                        className="chat-send-btn"
                                        onClick={sendMessage}
                                        disabled={ticketData?.status === "Resolved" || isUploading || (!text.trim() && !selectedFile)}
                                        title="Send"
                                    >
                                        <IoSendSharp />
                                    </button>
                                </div>

                                {ticketData?.status === "Resolved" && (
                                    <div
                                        style={{
                                            textAlign: "center",
                                            fontSize: "12px",
                                            color: "#9ca3af",
                                            paddingTop: "6px",
                                        }}
                                    >
                                        🔒 This ticket is resolved. Messaging is disabled.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── IMAGE MODAL ── */}
                {isOpen && (
                    <div className="modal show d-block" tabIndex="-1" onClick={handleClose}>
                        <div
                            className="modal-dialog modal-dialog-centered"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={handleClose}
                                    ></button>
                                </div>
                                <div
                                    className="modal-body text-center"
                                    style={{ padding: "20px", background: "#f9fafb" }}
                                >
                                    <img
                                        src={selectedImage}
                                        alt="Ticket Screenshot"
                                        style={{
                                            maxWidth: "100%",
                                            maxHeight: "70vh",
                                            objectFit: "contain",
                                            borderRadius: "8px",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketsView;