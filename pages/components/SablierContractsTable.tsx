import React, { useEffect, useState } from "react";
import { useQuery, gql } from "urql";

const now = Math.round(+new Date() / 1000);

const GET_STREAMS = gql`
  {
    streams(
      first: 100
      orderBy: stopTime
      orderDirection: desc
      where: { stopTime_gt: 0 }
    ) {
      id
      ratePerSecond
      stopTime
      sender
      token {
        id
        name
        symbol
        decimals
      }
    }
  }
`;

// Group all streams by unique senders
const groupStreamsBySender = (streams: any[]) => {
  const groups = streams.reduce((acc, stream) => {
    const key = stream.sender;
    if (!acc[key]) {
      acc[key] = [];
    }
    if (parseInt(stream.stopTime) > now) {
      acc[key].push(stream);
      return acc;
    }
  }, {});
  return Object.keys(groups).map((key) => ({
    key,
    streams: groups[key],
  }));
};

// Remove a stream where stopTime is less than now
const removeStoppedStreams = (streams: any[]) => {
  return streams.filter((stream) => stream.stopTime > now);
};

const SablierContractsTable = () => {
  const [result, reexecuteQuery] = useQuery({
    query: GET_STREAMS,
  });
  const { data, fetching, error } = result;
  const [senders, setSenders] = useState<any[]>([]);

  useEffect(() => {
    if (!data) return;
    const unique = groupStreamsBySender(data.streams);
    setSenders(unique);
  }, [data]);

  return (
    <>
      <p>{senders.length}</p>
      <pre>{JSON.stringify(senders, null, 2)}</pre>
    </>
  );
};

export default SablierContractsTable;
