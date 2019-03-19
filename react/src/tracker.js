import React, { Component } from 'react';


class Tracker extends Component{
    constructor(props){
        super(props);
        this.state = {
            sn:'',
            num:'',
            result:"",
            error:"",
        }
    }

    handleSubmit= (e) => {
        this.setState({result:[]})
        e.preventDefault();
        if (this.state.sn!=''){
            console.log("submitted"+this.state.sn)
            fetch("https://cloud.iexapis.com/beta/stock/"+this.state.sn+"/quote?token=pk_5b2a855aac2e4f28b9f09e10eeed77bd")
                .then(response=> {
                    if (response.status >= 300) {
                        this.setState(this.setState({error:"Unknown Symbol" ,result:"",}))
                        throw new Error("Unknown Symbol");
                    } else {
                        return response.json();
                    }
                })
                .then(data=>this.setState({error:"",result:data.latestPrice,}))
                .catch(()=>{})
        }
    }

    destory=()=>{
        this.props.restore();
        this.setState({sn:'',num:'',result:"",error:"",})
    }


    render(){
        var message = <div></div>;
        var queryResult = <div></div>;
            if (this.state.error!=""){
            message =(
                <div className="col-12 ">
                    <div className="alert alert-danger" role="alert">
                        <div className="d-flex justify-content-center">
                            {this.state.error}
                        </div>
                    </div>
                </div>)
        }
        if(this.state.result!=""){
            queryResult = (
                <div className="col-12">
                    <div className="alert alert-secondary" role="alert">
                        <div className="d-flex justify-content-center">
                            Stock Symbol:{this.state.sn}  Market Price Per Share:{this.state.result}  Calculated Price:{this.state.result*this.state.num}
                        </div>
                    </div>
                </div>
            )
        }


        if (this.props.isOn) {
            return (
                <div className="row">
                    <div className="col-12 d-flex justify-content-center">
                        <form className="form-inline " onSubmit={this.handleSubmit}>
                            <label className="pb-2 pr-1" htmlFor="inlineFormInputName2">Stock Symbol</label>
                            <input type="text" className="form-control mb-2 mr-sm-2" id="inlineFormInputName2"
                                   placeholder="aapl" value={this.state.sn} onChange={(event)=>{
                                       this.setState({sn:event.target.value});
                                       this.setState({result:""})
                                   }}/>

                            <label className="pb-2 pr-1" htmlFor="inlineFormInputGroupUsername2">Num</label>
                            <div className="input-group mb-2 mr-sm-2">
                                <input type="text" className="form-control" id="inlineFormInputGroupUsername2"
                                       placeholder="number of shares" value={this.state.num} onChange={(event)=>{this.setState({num:event.target.value})}}/>
                            </div>


                            <button type="submit" className="btn btn-primary mb-2 mr-1">Query</button>
                            <button type="submit" className="btn btn-primary mb-2" onClick={() => this.destory()}>Close</button>
                        </form>
                    </div>
                    {queryResult}
                    {message}
                </div>
            )
        }else{
            return(<div></div>)
        }
    }
}


export default Tracker;