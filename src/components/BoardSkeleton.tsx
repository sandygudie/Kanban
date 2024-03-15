import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function BoardSkeleton() {
  return (
    <SkeletonTheme
      height={12}
      borderRadius={30}
      baseColor="#20212c"
      highlightColor="#2b2c36"
    >
      <header className="dark:bg-secondary px-6 h-[50px] mini:h-[65px] flex flex-col justify-center  fixed w-full border border-[1px] border-gray/10">
        <div className="flex gap-x-36">
          <Skeleton width={100} />
          <Skeleton width={200} />
        </div>
      </header>
      <div className="flex pt-[4em] h-screen">
        <div className="hidden mini:block w-[220px] bg-secondary p-2 md:p-6 border border-r-[1px] border-gray/10">
          <div>
            <Skeleton />
            <div className="mt-8">
              <Skeleton />
              <Skeleton width={100} />
              <div className="mt-3">
                <div className="flex items-center gap-x-4">
                  <Skeleton width={15} height={15} />
                  <Skeleton width={100} />
                </div>
                <div className="flex items-center gap-x-4">
                  <Skeleton width={15} height={15} />
                  <Skeleton width={100} />
                </div>
                <div className="flex items-center gap-x-4">
                  <Skeleton width={15} height={15} />
                  <Skeleton width={100} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-10/12 pt-20 px-8 ">
          <div className="md:flex gap-x-24">
            <SkeletonTheme
              height={12}
              borderRadius={30}
              baseColor="#2b2c36"
              highlightColor="#20212c"
            >
              <Skeleton width={200} />
              <Skeleton width={200} />
            </SkeletonTheme>

           
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}
