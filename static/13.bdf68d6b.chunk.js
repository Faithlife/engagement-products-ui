webpackJsonp([13],{1576:function(t,e,n){var o=n(1),a=n(66),s=n(308).PageRenderer;s.__esModule&&(s=s.default);var i=a({displayName:"WrappedPageRenderer",getInitialState:function(){return{content:n(1632)}},componentWillMount:function(){},render:function(){return o.createElement(s,Object.assign({},this.props,{content:this.state.content}))}});i.__catalog_loader__=!0,t.exports=i},1632:function(t,e){t.exports='```react\nnoSource: true\n---\n<React.Fragment>\n\t<V6Banner>\n\t\t<AcceptsStyledSystemProps />\n\t</V6Banner>\n</React.Fragment>\n```\n\n### Default theme\n\n```react\nshowSource: true\nstate: { isChecked: false }\n---\n<RadioDemo>\n\t<Radio\n\t\tonClick={() => setState({ isChecked: !state.isChecked })}\n\t\tisChecked={state.isChecked}\n\t\ttitle={\'Click me\'}\n\t\ttype="button"\n\t/>\n</RadioDemo>\n```\n\n### Custom theme\n\n```react\nshowSource: true\nstate: { isChecked: false }\n---\n<RadioDemo>\n\t<ThemeProvider theme={{\n\t\tcolors: {\n\t\t\tradio: { primary: \'darkslateblue\', border: \'plum\' }\n\t\t}\n\t}}>\n\t\t<Radio\n\t\t\tonClick={() => setState({ isChecked: !state.isChecked })}\n\t\t\tisChecked={state.isChecked}\n\t\t\ttitle={\'Click me\'}\n\t\t\ttype="button"\n\t\t/>\n\t</ThemeProvider>\n</RadioDemo>\n```\n\n### Custom label component\n\n```react\nshowSource: true\nstate: { isChecked: false }\n---\n<RadioDemo>\n\t<Radio\n\t\tonClick={() => setState({ isChecked: !state.isChecked })}\n\t\tisChecked={state.isChecked}\n\t\ttype="button"\n\t>\n\t\t<span>No, click <b>me</b>!</span>\n\t</Radio>\n</RadioDemo>\n```\n\n### Disabled state\n\n```react\nshowSource: true\nstate: { isChecked: false }\n---\n<RadioDemo>\n\t<Radio\n\t\tonClick={() => setState({ isChecked: !state.isChecked })}\n\t\tisChecked={state.isChecked}\n\t\ttitle={\'You can\\\'t click me\'}\n\t\ttype="button"\n\t\tdisabled\n\t>\n\t</Radio>\n</RadioDemo>\n```\n\n### Custom icon/label props\n\nExtra props on the `Radio` component are passed to the container. To pass Styled System props to just the icon or just the label, use `Radio.Icon` and/or `Radio.Label` config components.\n\n```react\nshowSource: true\nstate: { isChecked: false }\n---\n<RadioDemo>\n\t<Radio\n\t\tonClick={() => setState({ isChecked: !state.isChecked })}\n\t\tisChecked={state.isChecked}\n\t\ttype="button"\n\t>\n\t\t<Radio.Icon size="25px" />\n\t\t<Radio.Label color="red">A bigger icon and a red label</Radio.Label>\n\t</Radio>\n</RadioDemo>\n```\n'}});
//# sourceMappingURL=13.bdf68d6b.chunk.js.map