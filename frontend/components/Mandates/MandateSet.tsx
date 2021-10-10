import { Link, TableCell } from "@mui/material";
import { useTranslation } from "next-i18next";
import React from "react";
import routes from "~/routes";
import { mandateStyles } from "./mandatestyles";

export default function MandateSet({ mandates }) {
  const { t, i18n } = useTranslation('mandate');
  const classes = mandateStyles();

  return (
    <TableCell align="left">
        {
          mandates.map( (mandate) => (mandate) ? (
            <Link href={routes.member(mandate.member.id)}>
              <p>{mandate.member.first_name} {mandate.member.last_name}</p>
            </Link>
          )
            : (<div>No mandates were found for this position.</div>)
        )}
      </TableCell>
  )
}
