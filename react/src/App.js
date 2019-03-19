import React, { Component } from 'react';
import './App.css';
import EditEntry from './new_entry';
import Tracker from './tracker';
import ListStock from './list_of_stocks';

class ExtendButton extends Component{
  render() {
    return(
        <a className="btn btn-primary" href="#" onClick={() => this.props.onClick()}>{this.props.content}</a>
    )
  }
}

class Total extends Component {
  render() {
    return (
        <p className="my-2">total:${this.props.totals.toFixed(2)} </p>
    )
  }
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sumPortfolio: 0,
      isNewEntry: false,
      isTracker: false,
      stockList: {},
      entryOption: {"buy": true, "value": ""},
    }
    this.up=this.up.bind(this)
  }
  updateLocal(){
    var temp = {}
    for (var symbol in this.state.stockList){
      temp[symbol]=this.state.stockList[symbol].num
    }
    console.log(temp)
    localStorage.easyStock = JSON.stringify(temp);
  }


  refreshTotal=()=>{
    var total = 0;
    for (var symbol in this.state.stockList){
      total += this.state.stockList[symbol].num*parseFloat(this.state.stockList[symbol].detail.latestPrice)
    }
    this.setState({sumPortfolio:total})
    this.updateLocal();
  }

  up(entry) {
    fetch("https://cloud.iexapis.com/beta/stock/" + entry[0] + "/quote?token=pk_5b2a855aac2e4f28b9f09e10eeed77bd")
        .then(response => response.json())
        .then(data => {
          this.state.stockList[entry[0]] = {num:entry[1],detail:data};
          console.log(this.state.stockList);
          this.setState(this.state);
          this.refreshTotal();
        })
  }

  task(){
    if ("easyStock" in localStorage){
      var list = JSON.parse(localStorage.getItem("easyStock"))
      var entries = Object.entries(list);
      for (var i=0;i<entries.length;i++){
        this.up(entries[i])
      }
    }
  }

  componentDidMount() {
    this.task();
    setInterval(()=>{this.task()},10000);//update the price every 10 s
  }



  render() {
    return (
        <div className="container mb-5">
          <div className="row mt-3 mb-2">
            <div className="col-6">
              <div className='ml-0'>
                <h2 className="ml-auto myheader">EasyStock</h2>
              </div>
            </div>
            <div className="col-6 d-flex">
              <div className="ml-auto">
                <ExtendButton onClick={()=>{this.setState({isTracker:true})}} content={"Stock Tracker"}/>
              </div>
            </div>
            <div className="col-12">
              <Tracker isOn={this.state.isTracker} restore={()=>{this.setState({isTracker:false})}}/>
            </div>
          </div>
          <hr/>
          <div className="row mt-3 mb-2">
            <div className="col-6">
              <ExtendButton onClick={()=>{this.setState({isNewEntry:true,entryOption:{"buy":true,"value":""}})}} content={"+ New Stock"} />
            </div>

            <div className="col-6 d-flex">
              <div className="ml-auto">
                <Total totals={this.state.sumPortfolio}/>
              </div>
            </div>
          </div>
          <div className="row mt-3 mb-2">
            <div className="col-12">
              <EditEntry entryOption = {this.state.entryOption} isNew={this.state.isNewEntry} restore={()=>{this.setState({isNewEntry:false})}} list={this.state.stockList}
                        refreshTotal={this.refreshTotal}/>
            </div>
            <div className="col-12">
              <ListStock list={this.state.stockList} setOption={(option)=>{this.setState({entryOption:option,isNewEntry:true})}} />
            </div>
          </div>
        </div>


    );
  }
}



export default App;
