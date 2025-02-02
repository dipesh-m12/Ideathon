"use client"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react";


export default function ReportsTable() {

  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:3000/reports');
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  return (
    <Table>
      <TableCaption>List of Reported Phishing Domains</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Domain</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Registrar</TableHead>
          <TableHead>Report Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((report) => (
          <TableRow
            key={report._id}
            className="cursor-pointer"
            onClick={() => {
              const info = report.whoisInfo;
              alert(
                `Domain Information:\n\n` +
                `Domain: ${info.domain_name}\n` +
                `Registrar: ${info.registrar}\n` +
                `Created: ${new Date(info.creation_date).toLocaleDateString()}\n` +
                `Expires: ${new Date(info.expiration_date).toLocaleDateString()}\n` +
                `Name Servers: ${info.name_servers?.join(', ')}\n` +
                `WHOIS Server: ${info.whois_server}\n`
              );
            }}
          >
            <TableCell>{report.url}</TableCell>
            <TableCell>{report.description}</TableCell>
            <TableCell>{report.whoisInfo.registrar || "undetected"}</TableCell>
            <TableCell>{new Date(report.timestamp).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

