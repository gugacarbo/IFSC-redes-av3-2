export interface COMMAND {
  cmd:
    | "list_req"
    | "list_resp"
    | "put_req"
    | "put_resp"
    | "get_req"
    | "get_resp";
}

export interface LIST_REQ extends COMMAND {
  cmd: "list_req";
}

export interface LIST_RESP extends COMMAND {
  cmd: "list_resp";
  files: "<file_list_vector>";
}

export interface PUT_REQ extends COMMAND {
  cmd: "put_req";
  file: "<file_name>";
  hash: "<hash_value>";
  value: "<file_byte_base64>";
}

export interface PUT_RESP extends COMMAND {
  cmd: "put_resp";
  file: "<file_name>";
  status: "<ok/fail>";
}

export interface GET_REQ extends COMMAND {
  cmd: "get_req";
  file: "<file_name>";
}

export interface GET_RESP extends COMMAND {
  cmd: "get_resp";
  file: "<file_name>";
  hash: "<hash_value>";
  value: "<file_byte_base64>";
}

export type Command =
  | LIST_REQ
  | LIST_RESP
  | PUT_REQ
  | PUT_RESP
  | GET_REQ
  | GET_RESP;

// // Handler function using discriminated union
// function handleCommand(cmd: Command): void {
//   switch (cmd.cmd) {
//     case "list_req":
//       // TypeScript knows cmd is LIST_REQ here
//       console.log("Processing list request");
//       break;
//     case "list_resp":
//       // TypeScript knows cmd is LIST_RESP here
//       console.log("Files:", cmd.files);
//       break;
//     case "put_req":
//       // TypeScript knows cmd is PUT_REQ here
//       console.log("Putting file:", cmd.file, cmd.hash);
//       break;
//     case "put_resp":
//       // TypeScript knows cmd is PUT_RESP here
//       console.log("Put status:", cmd.status);
//       break;
//     case "get_req":
//       // TypeScript knows cmd is GET_REQ here
//       console.log("Getting file:", cmd.file);
//       break;
//     case "get_resp":
//       // TypeScript knows cmd is GET_RESP here
//       console.log("Got file:", cmd.file, cmd.hash);
//       break;
//   }
// }
