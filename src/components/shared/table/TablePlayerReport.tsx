import React, { Fragment, useState, useEffect } from 'react';
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
  onReload?: () => void,
  customEmptyContent?: React.FC<any>
  resetSearch?: Boolean
}

type TableState = {
    sortedData: any[]
    sortOrder: number
    sortedBy: string
};

const RenderHead = (props: {
  columns: TableColumnType[],
  handleSortByName: any,
  handleSortByChipsBalanceTable: any,
  handleSortByHandsPlayed: any,
  handleSortByHandsWon: any,
  handleSortByTotalRake: any,
  hanleSortByTotalWinnings: any,
  handleSortTableByTournamentsPlayed: any
}) => {
  const [hovered, setHovered] = useState(false);
  const [sortOrder, setSortOrder] = useState(1);
  
  const renderCol = (col: TableColumnType) => {

    const handleNameClick = () => {
      props.handleSortByName();
    }
      
    const handleChipsBalanceClick = () => {
      props.handleSortByChipsBalanceTable();
    }

    const handleHandsPlayedClick = () => {
      props.handleSortByHandsPlayed();
    }

    const handleHandsWonClick = () => {
      props.handleSortByHandsWon();
    }

    const handleTotalRakeClick = () => {
      props.handleSortByTotalRake();
    }

    const handleTotalWinningsClick = () => {
      props.hanleSortByTotalWinnings();
    }

    const handleTournamentsPlayedClick = () => {
      props.handleSortTableByTournamentsPlayed();
    }

    const handleMouseEnter = (e: any) => {
      setHovered(true);
    };

    const handleMouseLeave = (e: any) => {
      setHovered(false);
    };

    const style = {
      cursor: hovered ? 'pointer' : 'auto',
      color: 'blue',
    };

    if (col.title === 'UserName') {
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
    } else if (col.title === 'Chips Balance') {
      return (
        <th
          key={`col-${col.dataIndex}`}
          style={style}
          onMouseEnter={() =>handleMouseEnter(col.title)}
          onMouseLeave={() =>handleMouseLeave(col.title)}
          onClick={handleChipsBalanceClick} 
        >
          {col.title}
        </th>
      );
    } else if (col.title === 'HandsPlayed') {
      return (
        <th
          key={`col-${col.dataIndex}`}
          style={style}
          onMouseEnter={() =>handleMouseEnter(col.title)}
          onMouseLeave={() =>handleMouseLeave(col.title)}
          onClick={handleHandsPlayedClick} 
        >
          {col.title}
        </th>
      );
    } else if (col.title === 'HandsWon') {
      return (
        <th
          key={`col-${col.dataIndex}`}
          style={style}
          onMouseEnter={() =>handleMouseEnter(col.title)}
          onMouseLeave={() =>handleMouseLeave(col.title)}
          onClick={handleHandsWonClick} 
        >
          {col.title}
        </th>
      );
    } else if (col.title === 'Total Rake') {
      return (
        <th
          key={`col-${col.dataIndex}`}
          style={style}
          onMouseEnter={() =>handleMouseEnter(col.title)}
          onMouseLeave={() =>handleMouseLeave(col.title)}
          onClick={handleTotalRakeClick} 
        >
          {col.title}
        </th>
      );
    } else if (col.title === 'Total Winnings') {
      return (
        <th
          key={`col-${col.dataIndex}`}
          style={style}
          onMouseEnter={() =>handleMouseEnter(col.title)}
          onMouseLeave={() =>handleMouseLeave(col.title)}
          onClick={handleTotalWinningsClick} 
        >
          {col.title}
        </th>
      );
    } else if (col.title === 'Number of Tournaments Played') {
      return (
        <th
          key={`col-${col.dataIndex}`}
          style={style}
          onMouseEnter={() =>handleMouseEnter(col.title)}
          onMouseLeave={() =>handleMouseLeave(col.title)}
          onClick={handleTournamentsPlayedClick} 
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
        sortedData: this.props.resetSearch === true ? [] : this.props.data,
        sortOrder: 1,
        sortedBy: '',
    };
    
  }

  componentDidUpdate(prevProps: TableProps) {
    if (this.props.resetSearch !== prevProps.resetSearch) {
      if (this.props.resetSearch === true) {
        this.setState({
          sortedData: [],
        });
      } else {
        this.setState({
          sortedData: this.props.data,
        });
      }
    }
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
    
      if (this.state.sortedBy !== 'userName' || this.state.sortOrder === -1) {
        sortedData.sort((a: any, b: any) => {
          if (a.userName > b.userName) return -1;
          if (a.userName < b.userName) return 1;
          return 0;
        });
        this.setState({
            sortedData,
            sortOrder: 1,
            sortedBy: 'userName',
          });
      } else {
          sortedData.sort((a: any, b: any) => {
            if (a.userName < b.userName) return -1;
            if (a.userName > b.userName) return 1;
            return 0;
          });
          this.setState({
            sortedData,
            sortOrder: -1,
            sortedBy: 'userName',
          });
        }
    }
    
    handleSortByChipsBalanceTable = () => {
      const sortedData = [...this.props.data];
    
      if (this.state.sortedBy !== 'realChips' || this.state.sortOrder === -1) {
        sortedData.sort((a: any, b: any) => {
          return parseInt(a.realChips) - parseInt(b.realChips);
        });
        this.setState({
          sortedData,
          sortOrder: 1,
          sortedBy: 'realChips',
        });
      } else {
        sortedData.sort((a: any, b: any) => {
          return parseInt(b.realChips) - parseInt(a.realChips);
        });
        this.setState({
          sortedData,
          sortOrder: -1,
          sortedBy: 'realChips',
        });
      }
  }
  
  handleSortByHandsPlayed = () => {
    const sortedData = [...this.props.data];

    if (this.state.sortedBy !== 'statisticsHandsPlayedRM' || this.state.sortOrder === -1) {
      sortedData.sort((a: any, b: any) => {
        return parseInt(b.statistics.handsPlayedRM) - parseInt(a.statistics.handsPlayedRM);
      });
      this.setState({
        sortedData,
        sortOrder: 1,
        sortedBy: 'statisticsHandsPlayedRM',
      });
    } else {
      sortedData.sort((a: any, b: any) => {
        return parseInt(a.statistics.handsPlayedRM) - parseInt(b.statistics.handsPlayedRM);
      });
      this.setState({
        sortedData,
        sortOrder: -1,
        sortedBy: 'statisticsHandsPlayedRM',
      });
    }
  }

  handleSortByHandsWon = () => {
    const sortedData = [...this.props.data];

    if (this.state.sortedBy !== 'statisticsHandsWonRM' || this.state.sortOrder === -1) {
      sortedData.sort((a: any, b: any) => {
        return parseInt(b.statistics.handsPlayedRM) - parseInt(a.statistics.handsPlayedRM);
      });
      this.setState({
        sortedData,
        sortOrder: 1,
        sortedBy: 'statisticsHandsWonRM',
      });
    } else {
      sortedData.sort((a: any, b: any) => {
        return parseInt(a.statistics.handsPlayedRM) - parseInt(b.statistics.handsPlayedRM);
      });
      this.setState({
        sortedData,
        sortOrder: -1,
        sortedBy: 'statisticsHandsWonRM',
      });
    }
  }

  handleSortByTotalRake = () => {
    const sortedData = [...this.props.data];

    if (this.state.sortedBy !== 'totalRake' || this.state.sortOrder === -1) {
      sortedData.sort((a: any, b: any) => {
        return parseInt(b.totalRake) - parseInt(a.totalRake);
      });
      this.setState({
        sortedData,
        sortOrder: 1,
        sortedBy: 'totalRake',
      });
    } else {
      sortedData.sort((a: any, b: any) => {
        return parseInt(a.totalRake) - parseInt(b.totalRake);
      });
      this.setState({
        sortedData,
        sortOrder: -1,
        sortedBy: 'totalRake',
      });
    }
  }

  hanleSortByTotalWinnings = () => {
    const sortedData = [...this.props.data];

    if (this.state.sortedBy !== 'totalWinnings' || this.state.sortOrder === -1) {
      sortedData.sort((a: any, b: any) => {
        return parseInt(b.totalWinnings) - parseInt(a.totalWinnings);
      });
      this.setState({
        sortedData,
        sortOrder: 1,
        sortedBy: 'totalWinnings',
      });
    } else {
      sortedData.sort((a: any, b: any) => {
        return parseInt(a.totalWinnings) - parseInt(b.totalWinnings);
      });
      this.setState({
        sortedData,
        sortOrder: -1,
        sortedBy: 'totalWinnings',
      });
    }
  }

  handleSortTableByTournamentsPlayed = () => {
    const sortedData = [...this.props.data];

    if (this.state.sortedBy !== 'tournamentsPlayed' || this.state.sortOrder === -1) {
      sortedData.sort((a: any, b: any) => {
        return parseInt(b.tournamentsPlayed) - parseInt(a.tournamentsPlayed);
      });
      this.setState({
        sortedData,
        sortOrder: 1,
        sortedBy: 'tournamentsPlayed',
      });
    } else {
      sortedData.sort((a: any, b: any) => {
        return parseInt(a.tournamentsPlayed) - parseInt(b.tournamentsPlayed);
      });
      this.setState({
        sortedData,
        sortOrder: -1,
        sortedBy: 'tournamentsPlayed',
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
                handleSortByChipsBalanceTable={this.handleSortByChipsBalanceTable}
                handleSortByHandsPlayed={this.handleSortByHandsPlayed}
                handleSortByHandsWon={this.handleSortByHandsWon}
                handleSortByTotalRake={this.handleSortByTotalRake}
                hanleSortByTotalWinnings={this.hanleSortByTotalWinnings}
                handleSortTableByTournamentsPlayed={this.handleSortTableByTournamentsPlayed}
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