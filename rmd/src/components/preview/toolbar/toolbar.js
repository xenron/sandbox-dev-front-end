import React from 'react';
import _ from 'lodash';
import $ from 'jquery';
import Icon from 'react-fa';
import loading from './loading.gif';
import Dropdown from '../dropdown/dropdown';
import Item from '../dropdown/dropdown_item';
import style from './toolbar.less';

export default class Toolbar extends React.Component {

    static propTypes = {
        title: React.PropTypes.string,
        onTitleChange: React.PropTypes.func
    };

    static defaultProps = {
        title: ``,
        onTitleChange: () => {
        }
    };

    state = {
        isShowMenu: false,
        isShowSpinner: false
    };

    onTitleChange(event) {
        const {posts, onEditPost} = this.props;
        let post = _.cloneDeep(_.find(posts, {selected: true}) || posts[0]);
        post.title = event.target.value;
        onEditPost(post);
    }

    onToggleMenu(event) {
        this.setState({isShowMenu: !this.state.isShowMenu});
        event.stopPropagation();
    }

    onCloseMenu(){
        this.setState({isShowMenu: false});
    }

    onNew(){
        this.props.onAddPost();
        this.setState({isShowMenu: false});
    }

    onSave() {
        this.props.onSavePosts(this.props.posts);
        this.setState({isShowMenu: false});

        this.setState({isShowSpinner: true});
        setTimeout(() => {
            this.setState({isShowSpinner: false});
        }, 500);
    }

    exportFile(content, filename){
        let a = document.createElement('a');
        a.setAttribute('style', 'display: none');
        document.body.appendChild(a);
        let blob = new Blob([content], {type: 'octet/stream'});
        let url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }

    onExportMarkdown() {
        const content = this.props.markdown.toString();
        this.exportFile(content, this.props.title ? `${this.props.title}.md` : 'untitled.md');

        this.setState({isShowMenu: false});
    }

    onExportHTML() {
        const title = this.props.title ? `${this.props.title}.html` : 'untitled.html';
        const html = `<!DOCTYPE html>
                        <html lang="en">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0">
                                <title>${title}</title>
                            </head>
                            <body>
                                ${this.props.html}
                            </body>
                        </html>`;
        this.exportFile(html, title);

        this.setState({isShowMenu: false});
    }

    onExportPDF() {
        // TODO
        this.setState({isShowMenu: false});
    }

    componentDidMount(){
        $(window).bind('click', this.onCloseMenu.bind(this));
    }

    componentWillUnmount(){
        $(window).unbind('click', this.onCloseMenu.bind(this));
    }

    render() {
        return (
            <div className={style.toolbar}>
                <div className={style.group}>
                    <a href="javascript:;" className={style.item} onClick={this.onToggleMenu.bind(this)}>
                        <Icon name="cog"/>
                    </a>
                    <Dropdown show={this.state.isShowMenu}>
                        <Item icon="file" onClick={this.onNew.bind(this)}>新建</Item>
                        <Item icon="refresh" onClick={this.onSave.bind(this)}>保存</Item>
                        <Item icon="download" onClick={this.onExportMarkdown.bind(this)}>导出Markdown</Item>
                        <Item icon="download" onClick={this.onExportHTML.bind(this)}>导出HTML</Item>
                        <Item icon="download" onClick={this.onExportPDF.bind(this)}>导出PDF</Item>
                        <Item icon="github" href="https://github.com/progrape/rmd">关于</Item>
                    </Dropdown>
                </div>
                <div className={style.group} style={{display: this.state.isShowSpinner ? 'block' : 'none'}}>
                    <a href="javascript:;" className={style.item}>
                        <img src={loading} className={style['loading']} alt=""/>
                    </a>
                </div>
                <div className={style.title}>
                    <input type="text" className={style.input} onChange={this.onTitleChange.bind(this)}
                           value={this.props.title} placeholder="请输入标题"/>
                </div>
            </div>
        );
    }
}