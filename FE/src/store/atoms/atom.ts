import axios from "axios";
import { atom, atomFamily, selector, selectorFamily } from "recoil";

export const contestState = atom({
  key: "contestState",
  default: selector({
    key: "contestSelector",
    get: async () => {
      const response = await axios.get("http://localhost:3001/api/all");
      return response.data.contests;
    },
  }),
});

export const bookmarkedState = atom({
  key: "bookmarkedState",
  default: selector({
    key: "bookmarkedStateSelector",
    get: async () => {
      const response = await axios.get("http://localhost:3001/api/bookmarks");
      return response.data.bookmarked;
    },
  }),
});

// export const filterAtom = atomFamily({
//   key:'filterAtom',
//   default:selectorFamily({
//     key:"filterAtomSelector",
//     get:(data:string)=> async()=>{
//         const response = await axios.get(`http://localhost:3001/api/filter`, data)
//       return response.data.contests
//     }
//   })
// })

export const filterAtom = atomFamily({
  key: "filterAtom",
  default: selectorFamily({
    key: "filterAtomSelector",
    get: (data: string) => async () => {
      try {
        const response = await axios.post(
          `http://localhost:3001/api/filter`,
          data,
          {
            headers: {
              "Content-Type": "application/json", // Ensure JSON is sent
            },
          },
        );

        console.log(response.data.contests.length);
        return response.data.contests;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
  }),
});
