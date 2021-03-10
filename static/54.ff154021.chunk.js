webpackJsonp([54],{1535:function(e,n,t){var a=t(1),o=t(66),r=t(308).PageRenderer;r.__esModule&&(r=r.default);var s=o({displayName:"WrappedPageRenderer",getInitialState:function(){return{content:t(1591)}},componentWillMount:function(){},render:function(){return a.createElement(r,Object.assign({},this.props,{content:this.state.content}))}});s.__catalog_loader__=!0,e.exports=s},1591:function(e,n){e.exports='```react\nnoSource: true\n---\n<HelpBox variant="success">\n\t<Paragraph>\n\t\tStyled-UI v6.0.0 has been released!\n\t\t<Button as="a" variant="link" href="/styled-ui/#/upgrade-guide" marginLeft={2}>Please check out the upgrade guide</Button>\n\t</Paragraph>\n</HelpBox>\n```\n\n## How to use\n\n1. Make sure a `.npmrc` file is present in your repo, which should contain something like: `@faithlife:registry=http://npm.faithlife.io`\n1. Run `yarn add @faithlife/styled-ui@^6.0.0`. Unlike v5, v6 should always be installed as a **direct** dependency.\n1. Run `yarn add --peer styled-components@^5.0.0`. Styled Components will break if more than one copy is present, and should be installed as a peer dependency if your package will be consumed by another app.\n1. Ship it!\n\n## Guidelines for use\n\nStyled-UI internally uses `styled-components` as its CSS-in-JS library, and makes use of `styled-system` props for referencing variables from our theme. New components added to this project should follow that same pattern.\n\nFor consumers of this library, each team has the flexibility to set their own standards for styling, whether that be with `styled-components` or another CSS-in-JS solution, or with classnames and LESS/CSS/SCSS/CSS Modules, etc.\n\nContributing guidelines can be found on [GitHub](https://github.com/Faithlife/styled-ui/#how-to-contribute).\n\n## If you are writing a library or integration\n\n- Use [webpack-node-externals](https://www.npmjs.com/package/webpack-node-externals)\n\nIf you are writing a package that will be required by someone else, you should exclude your `node_modules` from your Webpack bundle. This webpack plugin makes it easy.\n'}});
//# sourceMappingURL=54.ff154021.chunk.js.map