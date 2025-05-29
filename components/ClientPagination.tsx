"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Pagination from "./Pagination";

interface ClientPaginationProps {
  currentPage: number;
  totalPages: number;
  paramName: string;
}

const ClientPagination = ({
  currentPage,
  totalPages,
  paramName,
}: ClientPaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handlePageChange = (page: number) => {
    // Validate page number
    if (page < 1 || page > totalPages) return;

    const params = new URLSearchParams(searchParams);
    params.set(paramName, page.toString());

    // Using the latest Next.js 15.3 navigation pattern
    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
};

export default ClientPagination;
