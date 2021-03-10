webpackJsonp([43],{1555:function(t,e,n){var a=n(1),s=n(66),r=n(308).PageRenderer;r.__esModule&&(r=r.default);var d=s({displayName:"WrappedPageRenderer",getInitialState:function(){return{content:n(1611)}},componentWillMount:function(){},render:function(){return a.createElement(r,Object.assign({},this.props,{content:this.state.content}))}});d.__catalog_loader__=!0,t.exports=d},1611:function(t,e){t.exports='```react\nnoSource: true\n---\n<React.Fragment>\n\t<V6Banner>\n\t\t<AcceptsStyledSystemProps />\n\t</V6Banner>\n</React.Fragment>\n```\n\n## Default Date Picker\n\n```react\nshowSource: true\nstate: { selectedDate: null }\n---\n<div>\n\t<span>The selected date is {dateFunctions.format(state.selectedDate, \'MM-dd-yyyy\')}</span>\n\t<DatePickerInput\n\t\tdefaultSelectedDate={state.selectedDate || new Date()}\n\t\tonChange={(date) => setState({ selectedDate: date })}\n\t\tdateFunctions={dateFunctions}\n\t\tparseUserDateString={parseUserDateString}\n\t\tvalidate={() => true}\n\t/>\n</div>\n```\n\n## Customized placement of Date Picker\n\n```react\nshowSource: true\nstate: { selectedDate: null }\n---\n<div>\n\t<span>The selected date is {dateFunctions.format(state.selectedDate, \'MM-dd-yyyy\')}</span>\n\t<DatePickerInput\n\t\tdefaultSelectedDate={state.selectedDate || new Date()}\n\t\tonChange={(date) => setState({ selectedDate: date })}\n\t\tdateFunctions={dateFunctions}\n\t\tparseUserDateString={parseUserDateString}\n\t\tvalidate={() => true}\n\t\tplacement={"left-start"}\n\t/>\n</div>\n```\n\n## Custom props on Date Picker\n\nExtra props on the DatePicker Input will be passed to the Input. Useful for adding IDs to assign labels.\nAdditional config components can be used to pass props to the button and popover.\n\n```react\nshowSource: true\nstate: { selectedDate: null }\n---\n<div>\n\t<label htmlFor="date-picker-input">The selected date is {dateFunctions.format(state.selectedDate, \'MM-dd-yyyy\')}</label>\n\t<DatePickerInput\n\t\tid="date-picker-input"\n\t\tdefaultSelectedDate={state.selectedDate || new Date()}\n\t\tonChange={(date) => setState({ selectedDate: date })}\n\t\tdateFunctions={dateFunctions}\n\t\tparseUserDateString={parseUserDateString}\n\t\tvalidate={() => true}\n\t>\n\t\t<DatePickerInput.Button color="green4" />\n\t\t<DatePickerInput.Popover container="body" placement="left-start" />\n\t</DatePickerInput>\n</div>\n```\n'}});
//# sourceMappingURL=43.04d8cbb3.chunk.js.map