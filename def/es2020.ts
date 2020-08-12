import { Fork } from "../types";
import es7Def from "./es7";
import typesPlugin from "../lib/types";
import sharedPlugin from "../lib/shared";

export default function (fork: Fork) {
  fork.use(es7Def);

  const types = fork.use(typesPlugin);
  const def = types.Type.def;
  const Type = types.Type;
  const or = Type.or;
  const shared = fork.use(sharedPlugin);
  const defaults = shared.defaults;

  // https://github.com/tc39/proposal-optional-chaining
  // `a?.b` as per https://github.com/estree/estree/issues/146
  def("OptionalMemberExpression")
    .bases("MemberExpression")
    .build("object", "property", "computed", "optional")
    .field("optional", Boolean, defaults["true"])

  // a?.b()
  def("OptionalCallExpression")
    .bases("CallExpression")
    .build("callee", "arguments", "optional")
    .field("optional", Boolean, defaults["true"])


  // https://github.com/tc39/proposal-nullish-coalescing
  // `a ?? b` as per https://github.com/babel/babylon/pull/761/files
  const LogicalOperator = or("||", "&&", "??");

  def("LogicalExpression")
    .field("operator", LogicalOperator)

  def("ImportExpression")
    .bases("Expression")
    .build("source")
    .field("source", def("Expression"));
};
