import React from 'react';

const Pagination = ({ currentPage=1, totalPages=10, loading, onPageChange }) => {

    const changePage = (page) => {
        if (!loading) {
            onPageChange(page);
        }
    };
    const previousPage = () => {
        if (currentPage > 1) {
            changePage(currentPage - 1);
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            changePage(currentPage + 1);
        }
    };

    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + 2);
    if (endPage - startPage < 2) {
        startPage = Math.max(1, endPage - 2);
    }

    return (
        <ul className="mt-2 pagination pagination-separated pagination-sm mb-0 justify-content-center">
            <li className="page-item p-1">
                <button
                    onClick={previousPage}
                    disabled={loading || currentPage === 1}
                    style={{
                        cursor: loading || currentPage === 1 ? 'not-allowed' : 'auto',
                    }}
                    className={`border border-1 rounded ${loading || currentPage === 1 ? 'disabled' : ''}`}
                >
                    <span className="text_color">←</span>
                </button>
            </li>
            {[...Array(endPage - startPage + 1)]?.map((_, index) => {
                const page = startPage + index;
                return (
                    <li className="page-item p-1" key={page}>
                        <button
                            onClick={() => changePage(page)}
                            disabled={loading}
                            className={`border page-link border-1 rounded ${currentPage === page ? 'active' : ''}`}
                        >
                            <span>{page}</span>
                        </button>
                    </li>
                );
            })}
            <li className="page-item p-1">
                <button
                    onClick={nextPage}
                    disabled={loading || currentPage === totalPages}
                    style={{
                        cursor: loading || currentPage === totalPages ? 'not-allowed' : 'auto',
                    }}
                    className={`border border-1 rounded ${loading || currentPage === totalPages ? 'disabled' : ''}`}
                >
                    <span className="text_color">→</span>
                </button>
            </li>
        </ul>
    );
};

export default Pagination;
