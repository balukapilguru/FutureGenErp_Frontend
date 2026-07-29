import React from "react";

const Popup = ({ show, title, children, onClose, onSubmit }) => {
    if (!show) return null;

    return (
        <div>
            {/* Backdrop */}
            <div
                className="modal-backdrop show"
                style={{ opacity: 0.4 }}
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div
                className="modal d-block"
                tabIndex="-1"
                role="dialog"
                style={{ display: "block" }}
            >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">

                        {/* Header */}
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                            ></button>
                        </div>

                        {/* Body */}
                        <div className="modal-body">{children}</div>

                        {/* Footer */}
                        <div className="modal-footer">
                            {onSubmit && (<button className="btn btn_primary " onClick={onSubmit}>
                                Submit
                            </button>)}
                            <button className="btn btn-secondary" onClick={onClose}>
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Popup;