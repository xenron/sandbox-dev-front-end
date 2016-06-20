
import React from 'react';
import $ from 'jquery';
import Toolbar from './toolbar/toolbar';
import 'github-markdown-css/github-markdown.css';
import style from './preview.less';
import parser from './parse';

export default class Preview extends React.Component {

    static propTypes = {
        isFullScreen: React.PropTypes.bool,
        title: React.PropTypes.string,
        onTitleChange: React.PropTypes.func
    };

    static defaultProps = {
        isFullScreen: false,
        title: 'untitled',
        onTitleChange: () => {}
    };

    onTitleChange(title) {
        this.props.onTitleChange({title: title});
    }

    componentDidUpdate() {

        if(!this.props.isFullScreen){
            // render mathjax
            MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.refs.preview]);

            // render mermaid
            mermaid.init();
        }
    }

    render() {
        const {isFullScreen, posts, children, onEditPost, onSavePosts, onAddPost} = this.props;
        const html = parser(children.toString());
        const clazz = isFullScreen ? style['preview-full-screen'] : style['preview'];

        return (
            <div className={clazz}>
                <Toolbar
                    markdown={this.props.children}
                    title={this.props.title}
                    posts={posts}
                    onEditPost={onEditPost}
                    onSavePosts={onSavePosts}
                    onAddPost={onAddPost}
                    html={html}/>
                <div
                    className={`${style['preview-content']} markdown-body`}
                    ref="preview">
                    <div dangerouslySetInnerHTML={{__html: html}}></div>
                </div>
            </div>
        );
    }
}