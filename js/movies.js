const tmdb_api_key = "bde024f3eb43f597aafe01ed9c9098c6";

document.querySelector('#searchForm').addEventListener('submit',function(events){
    events.preventDefault()
    window.alert('nice')
})

class movieList extends React.Component {
    render(){
        return (<p>Hello</p>);
    }
}
ReactDom.render(<movieList,document.getElementById('root')
)