type NodeType = {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: NodeType[];
};
