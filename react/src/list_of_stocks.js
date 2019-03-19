import React, { Component } from 'react';

class Entry extends Component{
    constructor(props){
        super(props);
        this.state={
            show:false,
        }
    }
    render(){
        return(
            <tr>
                <td>{this.props.item[0]}</td>
                <td>{this.props.item[1].num}</td>
                <td>{this.props.item[1].detail.latestPrice}</td>
                <td>{(this.props.item[1].num*this.props.item[1].detail.latestPrice).toFixed(2)}</td>
                <td>
                    <div className="btn btn-dark" onClick={(event)=>{
                        document.body.scrollTop = document.documentElement.scrollTop = 0
                        this.props.setOption({"buy":true,"value":this.props.item[0]})
                        console.log(this.props.item[0]);
                    }}>
                        Buy
                    </div>
                    <div className="btn btn-dark" onClick={(event)=>{
                        document.body.scrollTop = document.documentElement.scrollTop = 0
                        this.props.setOption({"buy":false,"value":this.props.item[0]})

                    }}>
                        Sell
                    </div>
                </td>
            </tr>
        )
    }

}

class ListStock extends  Component{
    constructor(props){
        super(props);
        this.state={
            sortKey:"symbol",
            order:1
        }
        this.onSort=this.onSort.bind(this)
        this.handleClick=this.handleClick.bind(this)
    }

    onSort(data){
        if (this.state.sortKey=="Num"){
            data.sort((a,b)=>{return this.state.order*(a[1].num-b[1].num)})
        }else if (this.state.sortKey=="latestPrice"){
            data.sort((a,b)=>{ return this.state.order*(a[1].detail[this.state.sortKey] -b[1].detail[this.state.sortKey])})
        }else if (this.state.sortKey=="Sum"){
            data.sort((a,b)=>{ return this.state.order*(a[1].detail["latestPrice"]*a[1].num - b[1].detail["latestPrice"]*b[1].num)})
        }else{
            data.sort((a,b)=>this.state.order*(a[1].detail[this.state.sortKey].localeCompare(b[1].detail[this.state.sortKey])))
        }
    }

    handleClick(sortKey){
        if (this.state.sortKey==sortKey){
            this.setState({order:-1*this.state.order})
        }else{
            this.setState({sortKey:sortKey,order:1})
        }
    }



    render(){
        var items = Object.entries(this.props.list);
        this.onSort(items)

        var result=items.map(stock=>{
            return (
                <Entry item={stock} key={stock[0]} setOption={this.props.setOption} />
            )
        });
        return (
            <table className="table">
                <thead className="thead-dark">
                <tr>
                    <th scope="col" onClick={()=>{this.handleClick("symbol")}}>Symbol</th>
                    <th scope="col" onClick={()=>{this.handleClick("Num")}}>#Shares</th>
                    <th scope="col" onClick={()=>{this.handleClick("latestPrice")}}>Price</th>
                    <th scope="col" onClick={()=>{this.handleClick("Sum")}}>Value</th>
                    <th scope="col">Option</th>
                </tr>
                </thead>
                <tbody>
                    {result}
                </tbody>
            </table>
        )
    }
}
export default ListStock;