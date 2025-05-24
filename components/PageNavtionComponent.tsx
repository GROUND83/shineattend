import { Button } from "@/components/ui/button";

export default function PageNavtionComponent({
  pagination,
  handlePageChange,
}: {
  pagination: {
    page: number;
    total: number;
    totalPages: number;
  };
  handlePageChange: (page: number) => void;
}) {
  return (
    <div className="flex flex-row items-center justify-between space-y-4 ">
      <p className="text-sm text-muted-foreground">
        총 {pagination.total}명의 고객
      </p>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page <= 1}
          className="cursor-pointer"
        >
          이전
        </Button>

        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
          // 현재 페이지 주변의 페이지 번호만 표시
          let pageNum;
          if (pagination.totalPages <= 5) {
            pageNum = i + 1;
          } else if (pagination.page <= 3) {
            pageNum = i + 1;
          } else if (pagination.page >= pagination.totalPages - 2) {
            pageNum = pagination.totalPages - 4 + i;
          } else {
            pageNum = pagination.page - 2 + i;
          }

          return (
            <Button
              key={pageNum}
              variant={pagination.page === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(pageNum)}
              className="cursor-pointer"
            >
              {pageNum}
            </Button>
          );
        })}

        <Button
          variant="outline"
          className="cursor-pointer"
          size="sm"
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page >= pagination.totalPages}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
