import { useNavigate, useSearchParams } from "react-router-dom";

const Pagination = ({ page, pagination }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  // Handle pagination click
  const handlePageChange = (newPage) => {
    if (!pagination || newPage < 1 || newPage > pagination.totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    navigate(`?${params.toString()}`);
  };

  const renderPageNumbers = () => {
    if (!pagination) return null;

    const { totalPages } = pagination;
    const pages = [];
    const isMobile = window.innerWidth < 640;

    const delta = isMobile ? 1 : 2;
    const start = Math.max(1, page - delta);
    const end = Math.min(totalPages, page + delta);

    // First page
    if (start > 1) {
      pages.push(
        <li key={1}>
          <button
            onClick={() => handlePageChange(1)}
            className="px-3 sm:px-4 h-9 sm:h-10 rounded-[12px] text-gray-600 hover:bg-[var(--button-bg)] hover:text-white text-xs md:text-sm"
          >
            1
          </button>
        </li>
      );

      if (start > 2) {
        pages.push(
          <li
            key="start-ellipsis"
            className="px-2 text-gray-500 text-xs md:text-sm"
          >
            …
          </li>
        );
      }
    }

    // Middle pages
    for (let i = start; i <= end; i++) {
      pages.push(
        <li key={i}>
          <button
            onClick={() => handlePageChange(i)}
            aria-current={i === page ? "page" : undefined}
            className={`px-3 sm:px-4 h-9 sm:h-10 rounded-[12px] font-medium text-xs md:text-sm ${
              i === page
                ? "text-white bg-[var(--button-bg)]"
                : "text-gray-600 hover:bg-[var(--button-bg)] hover:text-white"
            }`}
          >
            {i}
          </button>
        </li>
      );
    }

    // Last page
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push(
          <li
            key="end-ellipsis"
            className="px-2 text-gray-500 text-xs md:text-sm"
          >
            …
          </li>
        );
      }

      pages.push(
        <li key={totalPages}>
          <button
            onClick={() => handlePageChange(totalPages)}
            className="px-3 sm:px-4 h-9 sm:h-10 rounded-[12px] text-gray-600 hover:bg-[var(--button-bg)] hover:text-white text-xs md:text-sm"
          >
            {totalPages}
          </button>
        </li>
      );
    }

    return pages;
  };
  return (
    <div className="w-full relative overflow-hidden">
      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <nav
          aria-label="Page navigation"
          className="flex justify-center sm:justify-end w-full mt-10 px-4 overflow-hidden"
        >
          <ul className="inline-flex items-center gap-1 sm:gap-1 px-2 text-sm sm:text-base h-auto sm:h-[58px] bg-[#E6E6E6BD] rounded-[12px] max-w-full overflow-x-auto sm:overflow-visible whitespace-nowrap">
            {/* Previous Button */}
            <li>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className={`flex items-center justify-center px-4 h-10 ms-0 leading-tight font-medium rounded-[12px] text-xs md:text-sm ${
                  page <= 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:bg-[var(--button-bg)] hover:text-white"
                }`}
              >
                Previous
              </button>
            </li>

            {/* Page Numbers */}
            {renderPageNumbers()}

            {/* Next Button */}
            <li>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= pagination.totalPages}
                className={`flex items-center justify-center px-4 h-10 leading-tight font-medium rounded-[12px] text-xs md:text-sm ${
                  page >= pagination.totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:bg-[var(--button-bg)] hover:text-white"
                }`}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Pagination;
