/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Skeleton,
  ExpandingRow,
  IconX,
  IconArrowUp,
  IconArrowDown,
  IconButton,
  Container,
  Text,
} from "sancho";
import * as uuid from "uuid";

interface Props {
  rows: object[] | any;
  columns: string[];
  columnIcons?: object | any;
  rowRenderer: (row: any, index: number, key?: any) => any;
  onRowClick: (row: any) => any;
  rowModifier?: (row: any) => void;
  columnSort?: (col: any) => void;
  expandedRowContent?: ({ close, row }: any) => any;
  expandable: boolean;
  defaultExpandableClose?: boolean;
  fakeRows?: number;
  columnsWidth?: string[];
  minWidth?: string;
  height?: string;
  id?: string;
}

export default function DataTable({
  rows,
  columns,
  columnIcons,
  rowRenderer,
  rowModifier,
  columnSort,
  onRowClick,
  expandedRowContent,
  expandable,
  defaultExpandableClose,
  fakeRows,
  columnsWidth,
  minWidth,
  height,
  id,
}: Props): React.ReactElement {
  const align: any = columns && columns.length >= 1 ? "center" : "left";
  const [_id] = React.useState<string>(id || uuid.v4());
  const [direction,setDirection] = React.useState<string>("DEC");

  const renderCell = (key: string, row: any, index: number) => {
    const modifier = rowModifier ? rowModifier(row) : row;
    return (
      <TableCell
        key={`${key}-${index}`}
        align={align}
        onClick={() => onRowClick(row)}
      >
        {rowRenderer(modifier, index, key)}
      </TableCell>
    );
  };

  const expandedContent = (close: any, row: any) => {
    return (
      <div>
        {expandedRowContent && expandedRowContent({ close, row })}
        {defaultExpandableClose && (
          <div style={{ float: "left" }}>
            <IconButton
              label={"Close"}
              variant="ghost"
              intent="danger"
              onPress={close}
              icon={<IconX />}
            />
          </div>
        )}
      </div>
    );
  };

  const renderRow = (row: any, index: number) => {
    const RowComponent = !expandable ? TableRow : ExpandingRow;
    const key: string = !row.id ? uuid.v4() : row.id;

    return (
      <RowComponent
        key={key}
        content={close => expandedContent(close, row)}
      >
        {columns.map((key: any) => renderCell(key, row, index))}
      </RowComponent>
    );
  };

  const renderFakeRow = (row: any) => {
    return (
      <TableRow key={`fake-row-${uuid.v1()}`}>
        {columns.map((col: string) => (
          <TableCell key={`fake-cell-col-${col}-${uuid.v1()}`} align={align}>
            <Text>{React.createElement(row, { animated: true })}</Text>
          </TableCell>
        ))}
      </TableRow>
    );
  };

  const renderRows = (): React.ReactElement | null => {
    const BodyComponent = !expandable ? TableBody : React.Fragment;

    if (!rows.length && !fakeRows) {
      return null;
    }

    if (!rows.length && fakeRows) {
      return (
        <BodyComponent>
          {Array.from(
            { length: fakeRows },
            () => Skeleton
          ).map(renderFakeRow)}
        </BodyComponent>
      );
    }

    return <BodyComponent>{rows.map(renderRow)}</BodyComponent>;
  };

  const columnRenderer = (key: string) => {
    const renderKey = () => {
      if (!columnIcons) {
        return key.toUpperCase();
      }
      return (
        <span css={{ fontWeight: "bolder" }}>
          {`${key.toUpperCase()}   `} {columnIcons[key] && columnIcons[key]}
        </span>
      );
    };

    const renderCaret = () => {
      if(columnSort && direction === 'DEC'){
        return <IconArrowDown style={{position:"absolute"}} size={"sm"}/>
      }
      if(columnSort && direction === 'ASC'){
        return <IconArrowUp style={{position:"absolute"}} size={"sm"}/>
      }
    }

    return (
      <TableCell
        key={key}
        align={align}
        onClick={() => {
          if(columnSort){
            setDirection(
              direction === "ASC"
              ? "DEC"
              : "ASC"
            );

            columnSort({
              key,
              direction,
              row: rows.map((r: any) => r[key])
            })
          }
        }}
      >
        {renderKey()}
        {renderCaret()}
      </TableCell>
    );
  };

  const container_css = css`
    & > div:nth-child(1) {
      height: ${!height
      ? "600px"
      : height && rows.length <= 10
        ? "auto"
        : height};
    }
  `;

  return (
    <Container id={"dataTable-container"} css={container_css}>
      <Table id={_id} fixed={columnsWidth} minWidth={minWidth}>
        <TableHead>
          <TableRow>{columns.map(columnRenderer)}</TableRow>
        </TableHead>
        {renderRows()}
      </Table>
    </Container>
  );
}
