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
          <TableHead>Status</TableHead>
          <TableHead>Report Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((report) => (
          <TableRow key={report._id}>
            <TableCell>{report.url}</TableCell>
            <TableCell>Pending</TableCell>
            <TableCell>{new Date(report.timestamp).toLocaleDateString()}</TableCell>
          </TableRow> 
        ))}
      </TableBody>
    </Table>
  )
}

