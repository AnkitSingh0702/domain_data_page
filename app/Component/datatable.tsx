"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  Bell,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import type { Domain } from "@/lib/data";
import { ModeToggle } from "@/components/theme";

interface DataTableProps {
  data: Domain[];
}

const PAGE_SIZE = 10;

export function DataTable({ data }: DataTableProps) {
  const router = useRouter();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Domain;
    direction: "asc" | "desc";
  } | null>(null);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    return data.filter((domain) =>
      Object.values(domain).some((value) =>
        String(value).toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [data, filter]);

  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }
        const aString = String(aValue).toLowerCase();
        const bString = String(bValue).toLowerCase();
        return sortConfig.direction === "asc"
          ? aString.localeCompare(bString)
          : bString.localeCompare(aString);
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return sortedData.slice(startIndex, startIndex + PAGE_SIZE);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / PAGE_SIZE);

  const toggleSort = (key: keyof Domain) => {
    setSortConfig((current) => ({
      key,
      direction:
        current?.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="flex flex-col min-h-screen max-w-full">
      <div className="flex justify-between items-center p-4 md:p-6 border-b">
        <h1 className="text-xl md:text-2xl font-bold">Domain Data</h1>
        <div className="flex items-center gap-2 md:gap-4">
          <ModeToggle />
          <Bell className="h-5 w-5 md:h-6 md:w-6 cursor-pointer" />
          <Button
            variant="destructive"
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm md:text-base"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 md:p-6">
        <Input
          placeholder="Search..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:max-w-sm rounded-lg border-2"
        />
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronFirst className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm whitespace-nowrap">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            disabled={currentPage === totalPages}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronLast className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-grow overflow-auto px-4 md:px-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {Object.keys(data[0] || {}).map((key) => (
                  <TableHead
                    key={key}
                    className="bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 whitespace-nowrap"
                  >
                    <Button
                      variant="ghost"
                      onClick={() => toggleSort(key as keyof Domain)}
                      className="font-bold hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      {key.charAt(0).toUpperCase() +
                        key
                          .slice(1)
                          .replace(/([A-Z])/g, " $1")
                          .trim()}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((domain, index) => (
                <TableRow key={index}>
                  {Object.values(domain).map((value, valueIndex) => (
                    <TableCell
                      key={valueIndex}
                      className="whitespace-nowrap text-center"
                    >
                      {value}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
