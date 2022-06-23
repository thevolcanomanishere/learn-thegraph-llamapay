import { gql, useQuery } from "@apollo/client";
import React from "react";

const GET_CONTRACTS = gql`
  {
    llamaPayFactories(first: 5) {
      id
      count
      address
      contracts {
        address
        token {
          symbol
        }
      }
    }
  }
`;

const ContractsList = () => {
  const { loading, error, data } = useQuery(GET_CONTRACTS);

  console.log(data);

  return (
    <div className="p-6 text-white">
      <table className="table-auto text-left ">
        <thead className="text-xl border">
          <tr>
            <th className="border-r pl-4">Song</th>
            <th className="border-r pl-4">Artist</th>
            <th className="border-r pl-24pr-4">Year</th>
          </tr>
        </thead>
        <tbody className="border">
          <tr>
            <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
            <td>Malcolm Lockyer</td>
            <td>1961</td>
          </tr>
          <tr>
            <td>Witchy Woman</td>
            <td>The Eagles</td>
            <td>1972</td>
          </tr>
          <tr>
            <td>Shining Star</td>
            <td>Earth, Wind, and Fire</td>
            <td>1975</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ContractsList;
