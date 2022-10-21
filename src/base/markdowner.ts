import {C as BC, MarkdownBlockParser} from "../parser/block/parser";
import {ASTHelper} from "./astHelper";
import {IncrementalParse} from "./incrementalParse"
import {RuleAdder, RuleDropper} from "./rules";
import {blockDefaultRules, BlockMarkdownRules, inlineDefaultRules, InlineMarkdownRules} from "../parser/rules";
import {MarkdownAST} from "./ast";
import {defaultInlineMap} from "../renderer/defaultRuleMaps/inline";
import {MarkdownerRuleMap} from "../renderer/utils";
import {defaultBlockMap} from "../renderer/defaultRuleMaps/block";
import {MarkdownerLogger} from "./logger";


interface MarkdownerProps {
    tabSpaceNum?: number
    softBreak?: boolean
    geneId?: boolean
}

export interface MarkdownerViewProps{
    content?: string
    children?: string
}

export class MarkdownerClass {
    blockParser?: BC.MarkdownBlockParser
    ast: ASTHelper
    dropRule: RuleDropper
    addRule: RuleAdder
    markdownerProps: MarkdownerProps = {}
    inlineRules: InlineMarkdownRules = inlineDefaultRules
    inlineRuleMap: MarkdownerRuleMap = defaultInlineMap
    blockRules: BlockMarkdownRules = blockDefaultRules
    blockRuleMap: MarkdownerRuleMap = defaultBlockMap

    constructor() {
        this.ast = new ASTHelper(this)
        this.dropRule = new RuleDropper(this)
        this.addRule = new RuleAdder(this)
    }

    init(props:MarkdownerProps={}) {
        this.markdownerProps = props
        let {tabSpaceNum, softBreak, geneId} = props
        this.blockParser = MarkdownBlockParser(this.blockRules, this.inlineRules, tabSpaceNum, softBreak, geneId)
        return this
    }

    parseInline(content: string) {
        if (!this.blockParser) {
            this.init()
        }

        return this.blockParser!.inlineParser!.new().parse(content)
    }

    incrementalParse(content: string) {
        this.init({...this.markdownerProps, geneId:true})
        return IncrementalParse.parse(this.ast.trees, this.parse(content))
    }

    parse(content: string): MarkdownAST[] {
        if (!this.blockParser) {
            this.init()
        }
        let trees = this.blockParser!.new().parse(content)
        this.ast.trees = trees

        return trees
    }

    new(props?:MarkdownerProps) {
        return new MarkdownerClass().init(props??this.markdownerProps)
    }

    debug(level: number=0) {
        MarkdownerLogger.setDebugLevel(level)
    }


}

export const Markdowner = new MarkdownerClass()

