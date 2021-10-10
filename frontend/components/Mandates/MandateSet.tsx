import { Grid, TableBody, TableCell, TableRow, Typography } from "@material-ui/core";
import { useTranslation } from "next-i18next";
import React from "react";
import { mandateStyles } from "./mandatestyles";

export default function MandateSet({ mandates }) {
  const { t, i18n } = useTranslation('mandate');
  const classes = mandateStyles();

  return (
    <>
      <TableCell align="left">
          {
            mandates.map( (mandate) => (mandate) ? (
              <p>{mandate.member.first_name} {mandate.member.last_name}</p>
            )
              : (<div>No mandates were found for this position.</div>)
          )}
        </TableCell>
    </>
  )
}
