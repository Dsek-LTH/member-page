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

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead style={{background: "rgb(255,192,203)"}}>
          <TableRow>
            <TableCell>Positions</TableCell>
            <TableCell>Mandates</TableCell>
          </TableRow>
        </TableHead>
        {data.mandatesByPosition.mandateMap.map((mandatesByPosition, i) => (mandatesByPosition) ? (
            <TableRow style={{background: i%2==1 ? "rgba(255,192,203,0.3)" : "FFFFFF"}}>
              <TableCell>{mandatesByPosition.mandate.position.name}</TableCell>
              <MandateSet mandates={mandatesByPosition.mandates}></MandateSet>
            </TableRow>
          )
            : (<div>No mandates were found for this year.</div>)
        )}
      </Table>
    </TableContainer>
  )
}
