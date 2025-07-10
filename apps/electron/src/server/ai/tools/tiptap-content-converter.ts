import { readFileSync } from 'fs';

// Type definitions for Tiptap JSON structure

/**
 * Represents a single node in the TipTap document structure
 */
interface TiptapNode {
  type: string; // Node type (paragraph, heading, list, etc.)
  text?: string; // Text content for text nodes
  content?: TiptapNode[]; // Child nodes for container elements
  attrs?: Record<string, any>; // Node attributes (level for headings, etc.)
  marks?: TiptapMark[]; // Text formatting marks (bold, italic, etc.)
}

/**
 * Represents text formatting marks in TipTap
 */
interface TiptapMark {
  type: string; // Mark type (bold, italic, link, etc.)
  attrs?: Record<string, any>; // Mark attributes (href for links, etc.)
}

/**
 * Root document structure for TipTap JSON
 */
interface TiptapDocument {
  type: 'doc'; // Root document type identifier
  content?: TiptapNode[]; // Top-level nodes in the document
}

/**
 * Configuration options for the converter
 */
interface ConverterOptions {
  bulletListMarker?: string; // Character to use for bullet lists (-, *, +)
  tightLists?: boolean; // Whether to use tight list formatting
}

/**
 * TipTap JSON to Markdown converter with fallback implementation
 * Converts TipTap editor JSON format to standard Markdown syntax
 * Works in Node.js environment without DOM dependencies
 */
export class TiptapToMarkdown {
  private options: Required<ConverterOptions>;

  /**
   * Initialize converter with configuration options
   * @param options - Converter configuration
   */
  constructor(options: ConverterOptions = {}) {
    this.options = {
      bulletListMarker: '-',
      tightLists: true,
      ...options
    };
  }

  /**
   * Convert TipTap JSON document to Markdown string
   * @param doc - TipTap document object
   * @returns Markdown formatted string
   */
  convert(doc: TiptapDocument): string {
    // Handle empty or invalid documents
    if (!doc || !doc.content) {
      return '';
    }

    // Convert each top-level node and join with double newlines
    return doc.content.map(node => this.convertNode(node)).join('\n\n').trim();
  }

  /**
   * Convert a single TipTap node to its Markdown equivalent
   * @param node - TipTap node to convert
   * @returns Markdown string representation
   */
  convertNode(node: TiptapNode): string {
    switch (node.type) {
      case 'heading':
        // Convert heading with appropriate level (1-6 #s)
        const level = node.attrs?.level || 1;
        const headingText = this.extractText(node);
        return '#'.repeat(level) + ' ' + headingText;

      case 'paragraph':
        // Simple paragraph - just extract text content
        return this.extractText(node);

      case 'bulletList':
        // Unordered list with bullet markers
        return this.convertList(node, false);

      case 'orderedList':
        // Numbered list with sequential numbering
        return this.convertList(node, true);

      case 'listItem':
        // Individual list item - convert child content
        return node.content?.map(child => this.convertNode(child)).join('\n') || '';

      case 'codeBlock':
        // Fenced code block with optional language
        const language = node.attrs?.language || '';
        const code = this.extractText(node);
        return '```' + language + '\n' + code + '\n```';

      case 'blockquote':
        // Quote block with > prefix for each line
        return node.content?.map(child => 
          '> ' + this.convertNode(child)
        ).join('\n> ') || '';

      case 'hardBreak':
        // Line break in Markdown format
        return '\\\n';

      case 'horizontalRule':
        // Horizontal rule/divider
        return '---';

      default:
        // Fallback for unknown node types - extract text content
        return this.extractText(node);
    }
  }

  /**
   * Convert list nodes to Markdown format
   * @param listNode - List container node
   * @param ordered - Whether this is an ordered (numbered) list
   * @returns Formatted list markdown
   */
  private convertList(listNode: TiptapNode, ordered: boolean = false): string {
    if (!listNode.content) return '';

    return listNode.content.map((item, index) => {
      // Generate appropriate list marker (number or bullet)
      const marker = ordered ? `${index + 1}. ` : `${this.options.bulletListMarker} `;
      const content = this.convertNode(item);
      
      // Handle nested lists and multiple paragraphs with proper indentation
      const lines = content.split('\n');
      const firstLine = marker + (lines[0] || '');
      const otherLines = lines.slice(1).map(line => 
        line ? '  ' + line : line  // Indent continuation lines
      );
      
      return [firstLine, ...otherLines].join('\n');
    }).join('\n');
  }

  /**
   * Extract plain text content from a node, processing all children recursively
   * @param node - Node to extract text from
   * @returns Plain text content with formatting marks applied
   */
  private extractText(node: TiptapNode): string {
    // Handle text nodes with potential formatting marks
    if (node.text) {
      return this.applyMarks(node.text, node.marks || []);
    }

    // Handle container nodes - process all children
    if (!node.content) {
      return '';
    }

    return node.content.map(child => this.extractText(child)).join('');
  }

  /**
   * Apply Markdown formatting based on TipTap marks
   * @param text - Plain text to format
   * @param marks - Array of formatting marks to apply
   * @returns Text with Markdown formatting applied
   */
  private applyMarks(text: string, marks: TiptapMark[]): string {
    let result = text;

    // Apply marks in specific order to handle nesting correctly
    // Order matters for proper Markdown rendering
    const markOrder = ['textStyle', 'link', 'code', 'strike', 'bold', 'italic'];
    const sortedMarks = marks.sort((a, b) => {
      const aIndex = markOrder.indexOf(a.type);
      const bIndex = markOrder.indexOf(b.type);
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });

    // Apply each mark's formatting
    for (const mark of sortedMarks) {
      switch (mark.type) {
        case 'bold':
          // Bold text with **
          result = `**${result}**`;
          break;
        case 'italic':
          // Italic text with *
          result = `*${result}*`;
          break;
        case 'code':
          // Inline code with backticks
          result = `\`${result}\``;
          break;
        case 'strike':
          // Strikethrough text with ~~
          result = `~~${result}~~`;
          break;
        case 'link':
          // Link with [text](url) format
          const href = mark.attrs?.href || '';
          result = `[${result}](${href})`;
          break;
        case 'textStyle':
          // Handle color and other text styles (fallback to plain text)
          // These don't have direct Markdown equivalents
          break;
        default:
          // Unknown mark, keep as plain text
          break;
      }
    }

    return result;
  }

  /**
   * Convert TipTap JSON from file to Markdown
   * @param filePath - Path to JSON file containing TipTap document
   * @returns Markdown string representation
   */
  convertFile(filePath: string): string {
    const jsonContent: TiptapDocument = JSON.parse(readFileSync(filePath, 'utf-8'));
    return this.convert(jsonContent);
  }
}
