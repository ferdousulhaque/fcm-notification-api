import {
    handleCors,
    handleBodyRequestParsing,
    handleCompression
  } from "./common";

  //import {whiteListIpToApi} from "./whiteListIp";
  
  import { handleAPIDocs } from "./apiDocs";
  
  export default [
    handleCors,
    handleBodyRequestParsing,
    handleCompression,
    handleAPIDocs
  ];