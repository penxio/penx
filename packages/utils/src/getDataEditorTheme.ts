export function getDataEditorTheme(isDark: boolean) {
  return {
    // accentColor: '#4F5DFF',
    accentColor: 'transparent',
    accentFg: '#FFFFFF',
    accentLight: 'rgba(62, 116, 253, 0.1)',

    textDark: isDark ? '#dfdfdf' : '#313139',
    textMedium: '#737383',
    textLight: '#222',
    textBubble: '#313139',

    bgIconHeader: '#737383',
    fgIconHeader: '#FFFFFF',
    textHeader: isDark ? '#dfdfdf' : '#000',
    textGroupHeader: '#313139BB',
    textHeaderSelected: '#FFFFFF',

    bgCell: isDark ? '#000' : '#FFFFFF',
    bgCellMedium: '#FAFAFB',
    bgHeader: isDark ? '#111' : '#fff',
    bgHeaderHasFocus: isDark ? '#111' : '#E9E9EB',
    bgHeaderHovered: isDark ? '#111' : '#EFEFF1',

    bgBubble: '#EDEDF3',
    bgBubbleSelected: '#FFFFFF',

    bgSearchResult: '#fff9e3',

    borderColor: 'rgba(115, 116, 131, 0.16)',
    drilldownBorder: 'rgba(0, 0, 0, 0)',

    linkColor: '#353fb5',
  }
}
