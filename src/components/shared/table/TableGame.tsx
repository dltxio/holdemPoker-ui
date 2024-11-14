import React, { Fragment, useState } from 'react';
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

type TableState = {
    sortedData: any[]
    sortOrder: number
    sortedBy: string
};

const RenderHead = (props: { columns: TableColumnType[], handleSortByName: any, handleSortByPlayersOnTable: any }) => {
  const [hovered, setHovered] = useState(false);
  const [sortOrder, setSortOrder] = useState(1);
  
  const renderCol = (col: TableColumnType) => {

    const handleNameClick = () => {
        // if (sortOrder === 1) {
        //     props.handleSortByName.sort((a: any, b: any) => {
        //         if (a.channelName < b.channelName) return -1;
        //         if (a.channelName > b.channelName) return 1;
        //         return 0;
        //     });
        //     setSortOrder(-1);
        // } else if (sortOrder === -1) {
        //     props.handleSortByName.sort((a: any, b: any) => {
        //         if (a.channelName > b.channelName) return -1;
        //         if (a.channelName < b.channelName) return 1;
        //         return 0;
        //     });
        //     setSortOrder(1);
        // }
        props.handleSortByName();
    }
      
    const handlePlayersOnTableClick = () => {
        // if (sortOrder === 1) {
        //     props.handleSortByName.sort((a: any, b: any) => {
        //         return parseInt(a.maxPlayers) - parseInt(b.maxPlayers);
        //     });
        //     setSortOrder(-1);
        // } else if (sortOrder === -1) {
        //     props.handleSortByName.sort((a: any, b: any) => {
        //         return parseInt(b.maxPlayers) - parseInt(a.maxPlayers);
        //     });
        //     setSortOrder(1);
        // }
        props.handleSortByPlayersOnTable();
    }
      

    const handleMouseEnter = (e: any) => {
      setHovered(true);
    };

    const handleMouseLeave = (e: any) => {
      setHovered(false);
    };

    const style = {
      cursor: hovered ? 'pointer' : 'auto',
      color: 'blue'
    };

    if (col.title === 'Name') {
      return (
        <th
          key={`col-${col.dataIndex}`}
          style={style}
          onMouseEnter={() =>handleMouseEnter(col.title)}
          onMouseLeave={() =>handleMouseLeave(col.title)}
          onClick={handleNameClick} 
        >
          {col.title}
        </th>
      );
    } else if (col.title === 'Players On Table') {
      return (
        <th
          key={`col-${col.dataIndex}`}
          style={style}
          onMouseEnter={() =>handleMouseEnter(col.title)}
          onMouseLeave={() =>handleMouseLeave(col.title)}
          onClick={handlePlayersOnTableClick} 
        >
          {col.title}
        </th>
      );
    } else {
      return (
        <th
          key={`col-${col.dataIndex}`}
        >
          {col.title}
        </th>
      );
    }
  };

  return (
    <thead>
      <tr>
        {props.columns.map(renderCol)}
      </tr>
    </thead>
  );
};

const RenderCustomEmpty: React.FC<any> = ({ customEmptyContent: CustomEmptyContent }) => {
  return CustomEmptyContent &&
    <CustomEmptyContent />
}
export class Table extends React.Component<TableProps, TableState> {
  constructor(props: TableProps) {
    super(props);
  
    this.state = {
        sortedData: this.props.data,
        sortOrder: 1,
        sortedBy: '',
    };
  }
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
    
    handleSortByName = () => {
        const sortedData = [...this.props.data];
    
        if (this.state.sortedBy !== 'Name' || this.state.sortOrder === -1) {
          sortedData.sort((a: any, b: any) => {
            if (a.channelName < b.channelName) return -1;
            if (a.channelName > b.channelName) return 1;
            return 0;
        });
        this.setState({
            sortedData,
            sortOrder: 1,
            sortedBy: 'Name',
          });
        } else {
          sortedData.sort((a: any, b: any) => {
            if (a.channelName > b.channelName) return -1;
            if (a.channelName < b.channelName) return 1;
            return 0;
          });
          this.setState({
            sortedData,
            sortOrder: -1,
            sortedBy: 'Name',
          });
        }
    }
    
    handleSortByPlayersOnTable = () => {
        const sortedData = [...this.props.data];
    
        if (this.state.sortedBy !== 'Players On Table' || this.state.sortOrder === -1) {
          sortedData.sort((a: any, b: any) => {
            return parseInt(a.maxPlayers) - parseInt(b.maxPlayers);
          });
          this.setState({
            sortedData,
            sortOrder: 1,
            sortedBy: 'Players On Table',
          });
        } else {
          sortedData.sort((a: any, b: any) => {
            return parseInt(b.maxPlayers) - parseInt(a.maxPlayers);
          });
          this.setState({
            sortedData,
            sortOrder: -1,
            sortedBy: 'Players On Table',
          });
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

    render (): React.ReactNode {
        const dataToDisplay = this.state.sortedData.length > 0 ? this.state.sortedData : this.props.data;
    return (
      <Fragment>
        <div className="table-content">
          <div className="table-scrollable">
            <table className="table">
              <RenderHead
                columns={this.props.columns}
                handleSortByName={this.handleSortByName}
                handleSortByPlayersOnTable={this.handleSortByPlayersOnTable}
              />

              <tbody>
                {dataToDisplay.map(this._renderRow)}
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