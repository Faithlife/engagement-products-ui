webpackJsonp([31],{1532:function(e,t,n){var a=n(1),u=n(66),r=n(308).PageRenderer;r.__esModule&&(r=r.default);var l=u({displayName:"WrappedPageRenderer",getInitialState:function(){return{content:n(1588)}},componentWillMount:function(){},render:function(){return a.createElement(r,Object.assign({},this.props,{content:this.state.content}))}});l.__catalog_loader__=!0,e.exports=l},1588:function(e,t){e.exports='### Small\n\n```react\nshowSource: true\nstate: { value: \'Washington\' }\n---\n<InputSpacer>\n\t<Input variant="small" value={state.value} onChange={event => setState({ value: event.target.value })} />\n\t<Button variant="primary" size="small">Search</Button>\n</InputSpacer>\n```\n\n### Medium\n\n```react\nshowSource: true\nstate: { value: \'Washington\' }\n---\n<InputSpacer>\n\t<Input variant="medium" value={state.value} onChange={event => setState({ value: event.target.value })} />\n\t<Button variant="primary" size="medium">Search</Button>\n</InputSpacer>\n```\n\n### Large\n\n```react\nshowSource: true\nstate: { value: \'Washington\' }\n---\n<InputSpacer>\n\t<Input variant="large" value={state.value} onChange={event => setState({ value: event.target.value })} />\n\t<Button variant="primary" size="large">Search</Button>\n</InputSpacer>\n```\n\n### Responsive\n\n```react\nshowSource: true\nstate: { value: \'Washington\' }\n---\n<InputSpacer>\n\t<Input variant={[\'medium\', \'small\']} value={state.value} onChange={event => setState({ value: event.target.value })} />\n\t<Button variant="primary" size={[\'medium\', \'small\']}>Search</Button>\n</InputSpacer>\n```\n\n### Textarea\n\n```react\nshowSource: true\nstate: { value: \'\' }\n---\n<InputSpacer>\n\t<Input textarea placeholder=\'My favorite state is...\' value={state.value} onChange={event => setState({ value: event.target.value })} resize="horizontal" height="120px" width="280px" />\n\t<Button variant="primary" size="small">Search</Button>\n</InputSpacer>\n```\n\n## FilterInput\n\nUse in UI that needs to inline-filter a list.\n\n```react\nshowSource: true\nstate: { value: \'Washington\' }\n---\n<FilterInput variant="medium" placeholder="Find" value={state.value} onChange={event => setState({ value: event.target.value })} onClear={() => setState({ value: \'\' })} />\n```\n\n## NumberInput\n\n```react\nshowSource: true\nstate: { value: 42 }\n---\n<InputSpacer>\n\t<InputSpacer>\n\t\t<NumberInput variant="small" value={state.value} onChange={event => setState({ value: event.target.value })} min={0} max={100} />\n\t</InputSpacer>\n\n\t<InputSpacer>\n\t\t<NumberInput variant="medium" value={state.value} onChange={event => setState({ value: event.target.value })} min={0} max={100} />\n\t</InputSpacer>\n</InputSpacer>\n\n```\n\n## Select on Focus\n\n```react\nshowSource: true\nstate: { value: \'Washington\' }\n---\n<Input selectOnFocus placeholder=\'My favorite state is...\' value={state.value} onChange={event => setState({ value: event.target.value })} />\n```\n'}});
//# sourceMappingURL=31.5e6087b8.chunk.js.map