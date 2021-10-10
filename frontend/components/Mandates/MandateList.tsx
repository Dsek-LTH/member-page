import { TableContainer, Paper, Table, TableHead, TableRow, TableCell } from "@mui/material";
import { useTranslation } from "next-i18next";
import React from "react";
import { useGetMandatesByYearQuery } from "~/generated/graphql";
import MandateSet from "./MandateSet";
import MandateSkeleton from "./MandateSkeleton";
import { mandateStyles } from "./mandatestyles";

export default function MandateList({ year }) {
  const { t, i18n } = useTranslation('mandate');

  const { data, loading, error } = useGetMandatesByYearQuery({
    variables: {year: parseInt(year)},
  });

  const classes = mandateStyles();
  const pink = "rgb(242,128,161)";

  if(loading) {
    return (
      <MandateSkeleton/>
    )
  }

  if(error) {
    return (
      <h2>Error</h2>
    )
  }

  const mandateMap = data.mandatesByPosition.mandateMap.map(mp =>
    ({ position: t(mp.mandate.position.name), mandates: mp.mandates})
  );
  const sortedMandateMap = mandateMap.sort((a, b) => a.position.localeCompare(b.position));

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead style={{background: pink}}>
          <TableRow>
            <TableCell>Positions</TableCell>
            <TableCell>Mandates</TableCell>
          </TableRow>
        </TableHead>
        {sortedMandateMap.map((mp, i) => (mp) ? (
            <TableRow style={{background: i%2==1 ? "rgba(242,128,161,0.1)" : "FFFFFF"}}>
              <TableCell>{ mp.position }</TableCell>
              <MandateSet mandates={mp.mandates}></MandateSet>
            </TableRow>
          )
            : (<div>No mandates were found for this year.</div>)
        )}
      </Table>
    </TableContainer>
  )
}
