import React, { Fragment } from 'react';
import FileSaver from 'file-saver';

// Components
import { Pagination, PaginationProps } from '../pagination/Pagination';

import './Table.scss';

export type TableColumnType = {
  title: string,
  dataIndex: string,
  customRender?: React.FC<{ column: TableColumnType, row: any, value: any }>,
  exportable?: boolean,
  emptyValue?: any,
  sortable?: boolean
}

export type TableProps = {
  columns: Array<TableColumnType>
  data: Array<any>,
  pagination?: PaginationProps,
  onPageChange?: (page: number, pageSize?: number) => void,
  onShowSizeChange?: (page: number, size: number) => void,
  onReload?: () => void
  customEmptyContent?: React.FC<any>
}

const RenderHead = (props: { columns: TableColumnType[] }) => {
  const renderCol = (col: TableColumnType) => {
    return (
      <th key={`col-${col.dataIndex}`}>{col.title}</th>
    )
  }

  return (
    <thead>
      <tr>
        {props.columns.map(renderCol)}
      </tr>
    </thead>
  )
}

const RenderCustomEmpty: React.FC<any> = ({ customEmptyContent: CustomEmptyContent }) => {
  return CustomEmptyContent &&
    <CustomEmptyContent />
}
export class Table extends React.Component<TableProps> {
  _renderCol = (row: any, rowIndex: number, col: TableColumnType, index: number) => {
    const CustomRender = col.customRender;
    let value;

    if (col.dataIndex === 'NO.') {
      if (this.props.pagination && this.props.pagination.current && this.props.pagination.pageSize) {
        value = (this.props.pagination.current - 1) * this.props.pagination.pageSize + rowIndex + 1;
      }

    } else {
      value = row[col.dataIndex];
    }

    const isEmpty = value === undefined || value === null || value === '';

    return (
      <td key={`col-${col.dataIndex}-${index}`}>
        {CustomRender && <CustomRender column={col} row={row} value={value} /> || (isEmpty ? col.emptyValue || '' : value)}
      </td>
    )
  }

  _renderRow = (row: any, rowIndex: number) => {
    return (
      <tr
        key={`row-${rowIndex}`}
      >
        {this.props.columns.map((item, index) => this._renderCol(row, rowIndex, item, index))}
      </tr>
    )
  }

  _handlePageChange = (page: number) => {
    if (this.props.onPageChange) {
      this.props.onPageChange(page);
    }
  }

  exportCsv(name = 'data') {
    const { data, columns } = this.props
    const isExportable = (col: any) => col.exportable === undefined ? true : col.exportable;
    const header = columns.filter(isExportable).map(col => JSON.stringify(col.title)).join(',')
    const body = data.map(row => {
      return columns.filter(isExportable).map(col => {
        const val = row[col.dataIndex];
        if (val === undefined || val === null || val === '') {
          return JSON.stringify(col.emptyValue || '');
        }
        return JSON.stringify(val);
      }).join(',');
    }).join('\n');
    const blob = new Blob([header, '\n' + body], { type: 'text/plain;charset=utf-8' });
    FileSaver.saveAs(blob, `${name}.csv`);
  }

  reload = () => {
    if (this.props.onReload) {
      this.props.onReload();
    }
  }

  render(): React.ReactNode {
    return (
      <Fragment>
        <div className="table-content">
          <div className="table-scrollable">
            <table className="table">
              <RenderHead
                columns={this.props.columns}
              />

              <tbody>
                {this.props.data.map(this._renderRow)}
              </tbody>
            </table>
            <RenderCustomEmpty customEmptyContent={this.props.customEmptyContent} />
          </div>

          {this.props.pagination && this.props.pagination.total ? <Pagination
            className="default"
            {...this.props.pagination}
            onChange={this._handlePageChange}
            onShowSizeChange={this.props.onShowSizeChange}
          /> : null}
        </div>
      </Fragment>
    )
  }
}