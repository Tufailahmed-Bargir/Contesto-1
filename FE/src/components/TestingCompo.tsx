import { useMemo } from "react";
import useFetchFilter, { useFetchAll } from "@/hooks/all";
 

export default function TestingFilter() {
  const {contests, loading, errors} = useFetchAll()
  console.log('data from hook is  ', contests);

  return (
    <div>
      <h1>Filtered Contest Data</h1>
      {loading && <p>Loading...</p>}
      {errors && <p>Error: {errors}</p>}
      {JSON.stringify(contests)}
    </div>
  );
}
