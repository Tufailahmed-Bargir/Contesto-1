import { ContainerScroll } from "../ui/container-scroll-animation";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Track, Compete, Conquer
              <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                All Coding Contests in One Place!
              </span>
            </h1>
          </>
        }
      >
        <img
          src={"/img.png"}
          alt="hero"
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
