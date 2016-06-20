
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import App from '../components/app';

function mapStateToProps(state) {
    return {
        posts: state.posts
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)