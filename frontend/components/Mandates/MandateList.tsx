import { TableContainer, Paper, Table, TableHead, TableRow, TableCell } from "@mui/material";
import { useTranslation } from "next-i18next";
import React from "react";
import { useGetMandatesByPeriodQuery } from "~/generated/graphql";
import MandateSet from "./MandateSet";
import MandateSkeleton from "./MandateSkeleton";
import { mandateStyles } from "./mandatestyles";

export default function MandateList({ year }) {
  const { t, i18n } = useTranslation('mandate');

  const { data, loading, error } = useGetMandatesByPeriodQuery({
    variables: {
      page: 0,
      perPage: 100,
      start_date: new Date(year, 0, 1),
      end_date: new Date(year, 12, 31),
    },
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

  function groupBy(dict, keyGetter, valueGetter) {
    const map = new Map();
    dict.forEach((item) => {
         const key = keyGetter(item);
         const x = valueGetter(item);
         if (!map.has(key)) {
            map.set(key, [x]);
         } else {
            map.get(key).push(x);
         }
    });
    return map;
  }

  const mandateList = data.mandates.mandates;
  const mandatesByPosition = groupBy(mandateList, e => t(e.position.name), e => e.member);
  const positions = Array.from(mandatesByPosition
                                .keys())
                                .sort((a, b) => a.localeCompare(b));

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead style={{background: pink}}>
          <TableRow>
            <TableCell>{t('positions')}</TableCell>
            <TableCell>{t('mandates')}</TableCell>
          </TableRow>
        </TableHead>
        {positions.map((p, i) => (mandatesByPosition.has(p)) ? (
          <TableRow style={{background: i%2==1 ? "rgba(242,128,161,0.1)" : "FFFFFF"}}>
            <TableCell>{ t(p) }</TableCell>
            <MandateSet members={mandatesByPosition.get(p)}></MandateSet>
          </TableRow>
          )
            : (
              <TableRow>
                <TableCell>{ t(p) }</TableCell>
                <TableCell>{ t('vakant') }</TableCell>
              </TableRow>
            )
        )}
      </Table>
    </TableContainer>
  )
}
