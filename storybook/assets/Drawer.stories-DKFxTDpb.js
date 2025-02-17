import{r as D,R as e}from"./index-CTjT7uj6.js";import{d as E}from"./Close-B7l6KHGX.js";import{D as i}from"./Drawer-B2X42fB4.js";import{m as w}from"./makeStyles-Dm18XSEu.js";import{B as o}from"./Button-DIC9OkW8.js";import{c as g}from"./createStyles-Bp4GwXob.js";import{T as h}from"./Typography-cLPqD11X.js";import{I as C}from"./IconButton-t4sr7qkK.js";import"./interopRequireDefault-Y9pwbXtE.js";import"./createSvgIcon-CdyNcF9g.js";import"./capitalize-DIeCfh_E.js";import"./defaultTheme-DXWIybXe.js";import"./withStyles-DXZDjQMO.js";import"./hoist-non-react-statics.cjs-DzIEFHQI.js";import"./useControlled-CogIeAPD.js";import"./index-QA7F3UF1.js";import"./createSvgIcon-BJFLD5ph.js";import"./isMuiElement-Cb6QZSLO.js";import"./unstable_useId-B3Hiq1YI.js";import"./useTheme-DSe7I3Kh.js";import"./Paper-qJ_yTBwO.js";import"./Modal-c6Oz2q5s.js";import"./classCallCheck-BNzALLS0.js";import"./Portal-DHXjgkAG.js";import"./Backdrop-B2nCY3ZH.js";import"./utils-BS_pqTfZ.js";import"./TransitionGroupContext-BtzQ-Cv7.js";import"./ButtonBase-CWOryP-z.js";import"./createStyles-yD3y8ldD.js";const Z={title:"Layout/Drawer",component:i},f=w(t=>g({paper:{width:"50%",justifyContent:"space-between",padding:t.spacing(2.5)}})),S=w(t=>g({header:{display:"flex",flexDirection:"row",justifyContent:"space-between"},icon:{fontSize:20},content:{height:"80%",backgroundColor:"#EEEEEE"},secondaryAction:{marginLeft:t.spacing(2.5)}})),y=({toggleDrawer:t})=>{const r=S();return e.createElement(e.Fragment,null,e.createElement("div",{className:r.header},e.createElement(h,{variant:"h5"},"Side Panel Title"),e.createElement(C,{key:"dismiss",title:"Close the drawer",onClick:()=>t(!1),color:"inherit"},e.createElement(E,{className:r.icon}))),e.createElement("div",{className:r.content}),e.createElement("div",null,e.createElement(o,{variant:"contained",color:"primary",onClick:()=>t(!1)},"Primary Action"),e.createElement(o,{className:r.secondaryAction,variant:"outlined",color:"primary",onClick:()=>t(!1)},"Secondary Action")))},a=()=>{const[t,r]=D.useState(!1),s=f();return e.createElement(e.Fragment,null,e.createElement(o,{variant:"contained",color:"primary",onClick:()=>r(!0)},"Open Default Drawer"),e.createElement(i,{classes:{paper:s.paper},anchor:"right",open:t,onClose:()=>r(!1)},e.createElement(y,{toggleDrawer:r})))},n=()=>{const[t,r]=D.useState(!1),s=f();return e.createElement(e.Fragment,null,e.createElement(o,{variant:"contained",color:"primary",onClick:()=>r(!0)},"Open Persistent Drawer"),e.createElement(i,{classes:{paper:s.paper},variant:"persistent",anchor:"right",open:t,onClose:()=>r(!1)},e.createElement(y,{toggleDrawer:r})))};a.__docgenInfo={description:"",methods:[],displayName:"DefaultDrawer"};n.__docgenInfo={description:"",methods:[],displayName:"PersistentDrawer"};var c,l,p;a.parameters={...a.parameters,docs:{...(c=a.parameters)==null?void 0:c.docs,source:{originalSource:`() => {
  const [isOpen, toggleDrawer] = useState(false);
  const classes = useDrawerStyles();
  return <>
      <Button variant="contained" color="primary" onClick={() => toggleDrawer(true)}>
        Open Default Drawer
      </Button>
      <Drawer classes={{
      paper: classes.paper
    }} anchor="right" open={isOpen} onClose={() => toggleDrawer(false)}>
        <DrawerContent toggleDrawer={toggleDrawer} />
      </Drawer>
    </>;
}`,...(p=(l=a.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};var m,u,d;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`() => {
  const [isOpen, toggleDrawer] = useState(false);
  const classes = useDrawerStyles();
  return <>
      <Button variant="contained" color="primary" onClick={() => toggleDrawer(true)}>
        Open Persistent Drawer
      </Button>
      <Drawer classes={{
      paper: classes.paper
    }} variant="persistent" anchor="right" open={isOpen} onClose={() => toggleDrawer(false)}>
        <DrawerContent toggleDrawer={toggleDrawer} />
      </Drawer>
    </>;
}`,...(d=(u=n.parameters)==null?void 0:u.docs)==null?void 0:d.source}}};const $=["DefaultDrawer","PersistentDrawer"];export{a as DefaultDrawer,n as PersistentDrawer,$ as __namedExportsOrder,Z as default};
