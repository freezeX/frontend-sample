import React, { Component } from 'react';
import Tracker from './tracker';


class EditEntry extends Tracker{
    constructor(props){
        super(props);
        this.state = {
            sn:'',
            num:'',
            message:'',
        }
    }

    query= (event) => {
        this.setState({message:''})
        event.preventDefault();
        if(this.props.entryOption.buy){
            fetch("https://cloud.iexapis.com/beta/stock/"+this.state.sn+"/quote?token=pk_5b2a855aac2e4f28b9f09e10eeed77bd")
                .then(response=>{
                    if (response.status>300){
                        throw new Error("Unknown Symbol")
                    }else{
                        return response.json();
                    }
                })
                .then(data=>{
                    var sn = data.symbol;
                    if (sn in this.props.list){
                        this.props.list[sn].num+=parseInt(this.state.num);
                    }else{
                        this.props.list[sn]={};
                        this.props.list[sn].num = parseInt(this.state.num);
                    }
                    this.props.list[sn].detail = data;
                    this.setState({message:"Success"})
                    console.log(this.props.list);
                    this.props.refreshTotal();
                })
                .catch((error)=>{
                    this.setState({message:error.message})
                })
        }else{
            var sn = this.state.sn;
            if(!this.props.list.hasOwnProperty(sn)){
                console.log("debug")
                this.setState({message:"No corresponding stock "})
                return
            }

            if (this.props.list[sn].num<this.state.num){
                this.setState({message:"No enough share"})
                return
            }
            this.props.list[sn].num-=this.state.num
            if (this.props.list[sn].num==0){
                delete this.props.list[sn]
            }
            this.setState({message:"Success"})
            this.props.refreshTotal();
        }

    }

    destory=()=>{
        this.props.restore();
        this.setState({sn:'',num:''})
        this.props.entryOption.value=''
    }



    render(){
        //not to trigger re-render
        if (this.props.entryOption.value!=''){
            this.state.sn = this.props.entryOption.value
        }
        var message;
        if (this.state.message!=''){
            message = (<div className="col-12 ">
                <div className="alert alert-secondary" role="alert">
                    <div className="d-flex justify-content-center">
                        {this.state.message}
                    </div>
                </div>
            </div>)
        }


        if (this.props.isNew) {
            return (
                <div className="row">
                    <div className="col-12 d-flex justify-content-center">
                        <form className="form-inline " onSubmit={this.query}>
                            <label className="pb-2 pr-1" htmlFor="inlineFormInputName2">Stock Symbol</label>
                            <input type="text" className="form-control mb-2 mr-sm-2" id="inlineFormInputName2"
                                   placeholder="" value={this.state.sn} onChange={(event)=>{
                                this.props.entryOption.value=''
                                       this.setState({sn:event.target.value})
                                   }} />

                            <label className="pb-2 pr-1" htmlFor="inlineFormInputGroupUsername2">Num</label>
                            <div className="input-group mb-2 mr-sm-2">
                                <input type="text" className="form-control" id="inlineFormInputGroupUsername2"
                                       placeholder="number of shares" value={this.state.num} onChange={(event)=>{this.setState({num:event.target.value})}}/>
                            </div>


                            <button type="submit" className="btn btn-primary mb-2 mr-1">{this.props.entryOption.buy?"Buy":"Sell"}</button>
                            <button type="submit" className="btn btn-primary mb-2" onClick={() => this.destory()}>Close</button>
                        </form>
                    </div>
                    {message}
                </div>
            )
        }else{
            return(<div></div>)
        }
    }
}
export default EditEntry;