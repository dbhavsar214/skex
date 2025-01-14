"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown } from "lucide-react"
import axios from "axios"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const API_KEY = 'HANpwneMzBkWenSTSfUF6ZtCzIkgypUj'; // Replace with your Polygon.io API key
const BASE_URL = 'https://api.polygon.io/v3/reference/tickers';
const BATCH_PRICE_URL = 'https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers';

const fetchStockList = async () => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                apiKey: API_KEY,
                limit: 50, // Adjust the limit as needed
            },
        });
        
        return response.data.results.map((stock: any) => ({
            id: stock.ticker,
            name: stock.name,
            symbol: stock.ticker,
            change: 0,
            price: 0,
        }));


    } catch (error) {
        console.error('Error fetching stock list:', error);
        return [];
    }
};

const fetchLivePrices = async (symbols: string[]) => {
    try {
        const response = await axios.get(BATCH_PRICE_URL, {
            params: {
                tickers: symbols.join(','),
                apiKey: API_KEY,
            },
        });
        

        return response.data.tickers.reduce((acc: Record<string, { price: number, change: number }>, ticker: any) => {
            acc[ticker.ticker] = {
                price: ticker.previousClose,
                change: ticker.todaysChangePerc,
            };
            return acc;
        }, {});
    } catch (error) {
        console.error('Error fetching live prices:', error);
        return {};
    }
};

export type Stock = {
    id: string
    name: string
    symbol: string
    change: number
    price: number
}

export const columns: ColumnDef<Stock>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "symbol",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Symbol
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="uppercase">{row.getValue("symbol")}</div>,
    },
    {
        accessorKey: "change",
        header: "Change",
        cell: ({ row }) => {
            const change = parseFloat(row.getValue("change"))
            const formattedChange = change.toFixed(2)
            const changeClass = change >= 0 ? 'text-green-500' : 'text-red-500'

            return <div className={changeClass}>{formattedChange}%</div>
        },
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"))
            return <div>${price.toFixed(2)}</div>
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const stock = row.original

            return (
                <div className="flex space-x-2">
                    <Link href={`/buy/${stock.symbol}`} passHref>
                        <Button variant="outline">
                            Buy
                        </Button>
                    </Link>
                    <Link href={`/sell/${stock.symbol}`} passHref>
                        <Button variant="outline">
                            Sell
                        </Button>
                    </Link>
                </div>
            )
        },
    },
]

const StockList = () => {
    const [stocks, setStocks] = React.useState<Stock[]>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    React.useEffect(() => {
        const getStockList = async () => {
            const stockList = await fetchStockList()
            setStocks(stockList)
        }
        getStockList()
    }, [])

    React.useEffect(() => {
        const interval = setInterval(async () => {
            const symbols = stocks.map(stock => stock.symbol);
            const chunkSize = Math.ceil(symbols.length / 5); // Batch size to stay within the API limit

            for (let i = 0; i < symbols.length; i += chunkSize) {
                const chunk = symbols.slice(i, i + chunkSize);
                const prices = await fetchLivePrices(chunk);

                setStocks(prevStocks =>
                    prevStocks.map(stock => ({
                        ...stock,
                        price: prices[stock.symbol]?.price || stock.price,
                        change: prices[stock.symbol]?.change || stock.change,
                    }))
                );
            }
        }, 60000); // Fetch every minute

        return () => clearInterval(interval);
    }, [stocks]);

    const table = useReactTable({
        data: stocks,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full p-16">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter stocks..."
                    value={(table.getColumn("symbol")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("symbol")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default StockList
