﻿/*
 * (c) Copyright Ascensio System SIA 2010-2015
 *
 * This program is a free software product. You can redistribute it and/or 
 * modify it under the terms of the GNU Affero General Public License (AGPL) 
 * version 3 as published by the Free Software Foundation. In accordance with 
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect 
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied 
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For 
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under 
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */
 "use strict";
var g_dDpiX = 96;
var g_dDpiY = 96;
var g_dKoef_mm_to_pix = g_dDpiX / 25.4;
var g_dKoef_pix_to_mm = 25.4 / g_dDpiX;
var g_fontManager = new CFontManager();
g_fontManager.Initialize(true);
function SetHintsProps(bIsHinting, bIsSubpixHinting) {
    if (undefined === g_fontManager.m_oLibrary.tt_hint_props) {
        return;
    }
    if (bIsHinting && bIsSubpixHinting) {
        g_fontManager.m_oLibrary.tt_hint_props.TT_USE_BYTECODE_INTERPRETER = true;
        g_fontManager.m_oLibrary.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING = true;
        g_fontManager.LOAD_MODE = 40968;
    } else {
        if (bIsHinting) {
            g_fontManager.m_oLibrary.tt_hint_props.TT_USE_BYTECODE_INTERPRETER = true;
            g_fontManager.m_oLibrary.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING = false;
            g_fontManager.LOAD_MODE = 40968;
        } else {
            g_fontManager.m_oLibrary.tt_hint_props.TT_USE_BYTECODE_INTERPRETER = true;
            g_fontManager.m_oLibrary.tt_hint_props.TT_CONFIG_OPTION_SUBPIXEL_HINTING = false;
            g_fontManager.LOAD_MODE = 40970;
        }
    }
}
SetHintsProps(true, true);
function CTableMarkup(Table) {
    this.Internal = {
        RowIndex: 0,
        CellIndex: 0,
        PageNum: 0
    };
    this.Table = Table;
    this.X = 0;
    this.Cols = [];
    this.Margins = [];
    this.Rows = [];
    this.CurCol = 0;
    this.CurRow = 0;
    this.TransformX = 0;
    this.TransformY = 0;
}
CTableMarkup.prototype = {
    CreateDublicate: function () {
        var obj = new CTableMarkup(this.Table);
        obj.Internal = {
            RowIndex: this.Internal.RowIndex,
            CellIndex: this.Internal.CellIndex,
            PageNum: this.Internal.PageNum
        };
        obj.X = this.X;
        var len = this.Cols.length;
        for (var i = 0; i < len; i++) {
            obj.Cols[i] = this.Cols[i];
        }
        len = this.Margins.length;
        for (var i = 0; i < len; i++) {
            obj.Margins[i] = {
                Left: this.Margins[i].Left,
                Right: this.Margins[i].Right
            };
        }
        len = this.Rows.length;
        for (var i = 0; i < len; i++) {
            obj.Rows[i] = {
                Y: this.Rows[i].Y,
                H: this.Rows[i].H
            };
        }
        obj.CurRow = this.CurRow;
        obj.CurCol = this.CurCol;
        return obj;
    },
    CorrectFrom: function () {
        this.X += this.TransformX;
        var _len = this.Rows.length;
        for (var i = 0; i < _len; i++) {
            this.Rows[i].Y += this.TransformY;
        }
    },
    CorrectTo: function () {
        this.X -= this.TransformX;
        var _len = this.Rows.length;
        for (var i = 0; i < _len; i++) {
            this.Rows[i].Y -= this.TransformY;
        }
    },
    Get_X: function () {
        return this.X;
    },
    Get_Y: function () {
        var _Y = 0;
        if (this.Rows.length > 0) {
            _Y = this.Rows[0].Y;
        }
        return _Y;
    }
};
function CTableOutline(Table, PageNum, X, Y, W, H) {
    this.Table = Table;
    this.PageNum = PageNum;
    this.X = X;
    this.Y = Y;
    this.W = W;
    this.H = H;
}
function CTextMeasurer() {
    this.m_oManager = new CFontManager();
    this.m_oFont = null;
    this.m_oTextPr = null;
    this.m_oLastFont = new CFontSetup();
    this.LastFontOriginInfo = {
        Name: "",
        Replace: null
    };
    this.Init = function () {
        this.m_oManager.Initialize();
    };
    this.SetFont = function (font) {
        if (!font) {
            return;
        }
        this.m_oFont = font;
        var bItalic = true === font.Italic;
        var bBold = true === font.Bold;
        var oFontStyle = FontStyle.FontStyleRegular;
        if (!bItalic && bBold) {
            oFontStyle = FontStyle.FontStyleBold;
        } else {
            if (bItalic && !bBold) {
                oFontStyle = FontStyle.FontStyleItalic;
            } else {
                if (bItalic && bBold) {
                    oFontStyle = FontStyle.FontStyleBoldItalic;
                }
            }
        }
        var _lastSetUp = this.m_oLastFont;
        if (_lastSetUp.SetUpName != font.FontFamily.Name || _lastSetUp.SetUpSize != font.FontSize || _lastSetUp.SetUpStyle != oFontStyle) {
            _lastSetUp.SetUpName = font.FontFamily.Name;
            _lastSetUp.SetUpSize = font.FontSize;
            _lastSetUp.SetUpStyle = oFontStyle;
            g_fontApplication.LoadFont(_lastSetUp.SetUpName, window.g_font_loader, this.m_oManager, _lastSetUp.SetUpSize, _lastSetUp.SetUpStyle, 72, 72, undefined, this.LastFontOriginInfo);
        }
    };
    this.SetTextPr = function (textPr, theme) {
        this.m_oTextPr = textPr.Copy();
        this.theme = theme;
        var FontScheme = theme.themeElements.fontScheme;
        this.m_oTextPr.RFonts.Ascii = {
            Name: FontScheme.checkFont(this.m_oTextPr.RFonts.Ascii.Name),
            Index: -1
        };
        this.m_oTextPr.RFonts.EastAsia = {
            Name: FontScheme.checkFont(this.m_oTextPr.RFonts.EastAsia.Name),
            Index: -1
        };
        this.m_oTextPr.RFonts.HAnsi = {
            Name: FontScheme.checkFont(this.m_oTextPr.RFonts.HAnsi.Name),
            Index: -1
        };
        this.m_oTextPr.RFonts.CS = {
            Name: FontScheme.checkFont(this.m_oTextPr.RFonts.CS.Name),
            Index: -1
        };
    };
    this.SetFontSlot = function (slot, fontSizeKoef) {
        var _rfonts = this.m_oTextPr.RFonts;
        var _lastFont = this.m_oLastFont;
        switch (slot) {
        case fontslot_ASCII:
            _lastFont.Name = _rfonts.Ascii.Name;
            _lastFont.Index = _rfonts.Ascii.Index;
            _lastFont.Size = this.m_oTextPr.FontSize;
            _lastFont.Bold = this.m_oTextPr.Bold;
            _lastFont.Italic = this.m_oTextPr.Italic;
            break;
        case fontslot_CS:
            _lastFont.Name = _rfonts.CS.Name;
            _lastFont.Index = _rfonts.CS.Index;
            _lastFont.Size = this.m_oTextPr.FontSizeCS;
            _lastFont.Bold = this.m_oTextPr.BoldCS;
            _lastFont.Italic = this.m_oTextPr.ItalicCS;
            break;
        case fontslot_EastAsia:
            _lastFont.Name = _rfonts.EastAsia.Name;
            _lastFont.Index = _rfonts.EastAsia.Index;
            _lastFont.Size = this.m_oTextPr.FontSize;
            _lastFont.Bold = this.m_oTextPr.Bold;
            _lastFont.Italic = this.m_oTextPr.Italic;
            break;
        case fontslot_HAnsi:
            default:
            _lastFont.Name = _rfonts.HAnsi.Name;
            _lastFont.Index = _rfonts.HAnsi.Index;
            _lastFont.Size = this.m_oTextPr.FontSize;
            _lastFont.Bold = this.m_oTextPr.Bold;
            _lastFont.Italic = this.m_oTextPr.Italic;
            break;
        }
        if (undefined !== fontSizeKoef) {
            _lastFont.Size *= fontSizeKoef;
        }
        var _style = 0;
        if (_lastFont.Italic) {
            _style += 2;
        }
        if (_lastFont.Bold) {
            _style += 1;
        }
        if (_lastFont.Name != _lastFont.SetUpName || _lastFont.Size != _lastFont.SetUpSize || _style != _lastFont.SetUpStyle) {
            _lastFont.SetUpName = _lastFont.Name;
            _lastFont.SetUpSize = _lastFont.Size;
            _lastFont.SetUpStyle = _style;
            g_fontApplication.LoadFont(_lastFont.SetUpName, window.g_font_loader, this.m_oManager, _lastFont.SetUpSize, _lastFont.SetUpStyle, 72, 72, undefined, this.LastFontOriginInfo);
        }
    };
    this.GetTextPr = function () {
        return this.m_oTextPr;
    };
    this.GetFont = function () {
        return this.m_oFont;
    };
    this.Measure = function (text) {
        var Width = 0;
        var Height = 0;
        var _code = text.charCodeAt(0);
        if (null != this.LastFontOriginInfo.Replace) {
            _code = g_fontApplication.GetReplaceGlyph(_code, this.LastFontOriginInfo.Replace);
        }
        var Temp = this.m_oManager.MeasureChar(_code);
        Width = Temp.fAdvanceX * 25.4 / 72;
        Height = 0;
        return {
            Width: Width,
            Height: Height
        };
    };
    this.Measure2 = function (text) {
        var Width = 0;
        var _code = text.charCodeAt(0);
        if (null != this.LastFontOriginInfo.Replace) {
            _code = g_fontApplication.GetReplaceGlyph(_code, this.LastFontOriginInfo.Replace);
        }
        var Temp = this.m_oManager.MeasureChar(_code);
        Width = Temp.fAdvanceX * 25.4 / 72;
        return {
            Width: Width,
            Ascent: (Temp.oBBox.fMaxY * 25.4 / 72),
            Height: ((Temp.oBBox.fMaxY - Temp.oBBox.fMinY) * 25.4 / 72),
            WidthG: ((Temp.oBBox.fMaxX - Temp.oBBox.fMinX) * 25.4 / 72)
        };
    };
    this.MeasureCode = function (lUnicode) {
        var Width = 0;
        var Height = 0;
        if (null != this.LastFontOriginInfo.Replace) {
            lUnicode = g_fontApplication.GetReplaceGlyph(lUnicode, this.LastFontOriginInfo.Replace);
        }
        var Temp = this.m_oManager.MeasureChar(lUnicode);
        Width = Temp.fAdvanceX * 25.4 / 72;
        Height = 0;
        return {
            Width: Width,
            Height: Height
        };
    };
    this.Measure2Code = function (lUnicode) {
        var Width = 0;
        if (null != this.LastFontOriginInfo.Replace) {
            lUnicode = g_fontApplication.GetReplaceGlyph(lUnicode, this.LastFontOriginInfo.Replace);
        }
        var Temp = this.m_oManager.MeasureChar(lUnicode);
        Width = Temp.fAdvanceX * 25.4 / 72;
        return {
            Width: Width,
            Ascent: (Temp.oBBox.fMaxY * 25.4 / 72),
            Height: ((Temp.oBBox.fMaxY - Temp.oBBox.fMinY) * 25.4 / 72),
            WidthG: ((Temp.oBBox.fMaxX - Temp.oBBox.fMinX) * 25.4 / 72)
        };
    };
    this.GetAscender = function () {
        var UnitsPerEm = this.m_oManager.m_lUnits_Per_Em;
        var Ascender = this.m_oManager.m_lAscender;
        return Ascender * this.m_oLastFont.SetUpSize / UnitsPerEm * g_dKoef_pt_to_mm;
    };
    this.GetDescender = function () {
        var UnitsPerEm = this.m_oManager.m_lUnits_Per_Em;
        var Descender = this.m_oManager.m_lDescender;
        return Descender * this.m_oLastFont.SetUpSize / UnitsPerEm * g_dKoef_pt_to_mm;
    };
    this.GetHeight = function () {
        var UnitsPerEm = this.m_oManager.m_lUnits_Per_Em;
        var Height = this.m_oManager.m_lLineHeight;
        return Height * this.m_oLastFont.SetUpSize / UnitsPerEm * g_dKoef_pt_to_mm;
    };
}
var g_oTextMeasurer = new CTextMeasurer();
g_oTextMeasurer.Init();
function CTableOutlineDr() {
    var image_64 = "u7u7/7u7u/+7u7v/u7u7/7u7u/+7u7v/u7u7/7u7u/+7u7v/u7u7/7u7u/+7u7v/u7u7/7u7u//6+vr/+vr6//r6+v/6+vr/+vr6//r6+v/6+vr/+vr6//r6+v/6+vr/+vr6/4+Pj/+7u7v/9vb2//b29v/39/f/9/f3//f39/83aMT/9/f3//f39//39/f/9/f3//f39/+Pj4//u7u7//Ly8v/y8vL/8vLy//Pz8/83aMT/N2jE/zdoxP/z8/P/8/Pz//Pz8//z8/P/j4+P/7u7u//u7u7/7u7u/+7u7v/u7u7/7u7u/zdoxP/u7u7/7u7u/+7u7v/u7u7/7u7u/4+Pj/+7u7v/6Ojo/+jo6P83aMT/6enp/+np6f83aMT/6enp/+np6f83aMT/6enp/+np6f+Pj4//u7u7/+Pj4/83aMT/N2jE/zdoxP83aMT/N2jE/zdoxP83aMT/N2jE/zdoxP/k5OT/j4+P/7u7u//o6Oj/6Ojo/zdoxP/o6Oj/6Ojo/zdoxP/o6Oj/6Ojo/zdoxP/o6Oj/6Ojo/4+Pj/+7u7v/7e3t/+3t7f/t7e3/7e3t/+3t7f83aMT/7e3t/+zs7P/s7Oz/7Ozs/+zs7P+Pj4//u7u7//Ly8v/y8vL/8vLy//Ly8v83aMT/N2jE/zdoxP/x8fH/8fHx//Hx8f/x8fH/j4+P/7u7u//19fX/9fX1//X19f/19fX/9fX1/zdoxP/19fX/9fX1//X19f/19fX/9fX1/4+Pj/+7u7v/+fn5//n5+f/5+fn/+fn5//n5+f/5+fn/+fn5//n5+f/5+fn/+fn5//j4+P+Pj4//u7u7/4+Pj/+Pj4//j4+P/4+Pj/+Pj4//j4+P/4+Pj/+Pj4//j4+P/4+Pj/+Pj4//j4+P/w==";
    this.image = document.createElement("canvas");
    this.image.width = 13;
    this.image.height = 13;
    var ctx = this.image.getContext("2d");
    var _data = ctx.createImageData(13, 13);
    DecodeBase64(_data, image_64);
    ctx.putImageData(_data, 0, 0);
    _data = null;
    image_64 = null;
    this.TableOutline = null;
    this.Counter = 0;
    this.bIsNoTable = true;
    this.bIsTracked = false;
    this.CurPos = null;
    this.TrackTablePos = 0;
    this.TrackOffsetX = 0;
    this.TrackOffsetY = 0;
    this.InlinePos = null;
    this.IsChangeSmall = true;
    this.ChangeSmallPoint = null;
    this.TableMatrix = null;
    this.CurrentPageIndex = null;
    this.checkMouseDown = function (pos, word_control) {
        if (null == this.TableOutline) {
            return false;
        }
        var _table_track = this.TableOutline;
        var _d = 13 * g_dKoef_pix_to_mm * 100 / word_control.m_nZoomValue;
        this.IsChangeSmall = true;
        this.ChangeSmallPoint = pos;
        if (!this.TableMatrix || global_MatrixTransformer.IsIdentity(this.TableMatrix)) {
            if (word_control.MobileTouchManager) {
                var _move_point = word_control.MobileTouchManager.TableMovePoint;
                if (_move_point == null || pos.Page != _table_track.PageNum) {
                    return false;
                }
                var _pos1 = word_control.m_oDrawingDocument.ConvertCoordsToCursorWR(pos.X, pos.Y, pos.Page);
                var _pos2 = word_control.m_oDrawingDocument.ConvertCoordsToCursorWR(_move_point.X, _move_point.Y, pos.Page);
                var _eps = word_control.MobileTouchManager.TrackTargetEps;
                var _offset1 = word_control.MobileTouchManager.TableRulersRectOffset;
                var _offset2 = _offset1 + word_control.MobileTouchManager.TableRulersRectSize;
                if ((_pos1.X >= (_pos2.X - _offset2 - _eps)) && (_pos1.X <= (_pos2.X - _offset1 + _eps)) && (_pos1.Y >= (_pos2.Y - _offset2 - _eps)) && (_pos1.Y <= (_pos2.Y - _offset1 + _eps))) {
                    this.TrackTablePos = 0;
                    return true;
                }
                return false;
            }
            switch (this.TrackTablePos) {
            case 1:
                var _x = _table_track.X + _table_track.W;
                var _b = _table_track.Y;
                var _y = _b - _d;
                var _r = _x + _d;
                if ((pos.X > _x) && (pos.X < _r) && (pos.Y > _y) && (pos.Y < _b)) {
                    this.TrackOffsetX = pos.X - _x;
                    this.TrackOffsetY = pos.Y - _b;
                    return true;
                }
                return false;
            case 2:
                var _x = _table_track.X + _table_track.W;
                var _y = _table_track.Y + _table_track.H;
                var _r = _x + _d;
                var _b = _y + _d;
                if ((pos.X > _x) && (pos.X < _r) && (pos.Y > _y) && (pos.Y < _b)) {
                    this.TrackOffsetX = pos.X - _x;
                    this.TrackOffsetY = pos.Y - _y;
                    return true;
                }
                return false;
            case 3:
                var _r = _table_track.X;
                var _x = _r - _d;
                var _y = _table_track.Y + _table_track.H;
                var _b = _y + _d;
                if ((pos.X > _x) && (pos.X < _r) && (pos.Y > _y) && (pos.Y < _b)) {
                    this.TrackOffsetX = pos.X - _r;
                    this.TrackOffsetY = pos.Y - _y;
                    return true;
                }
                return false;
            case 0:
                default:
                var _r = _table_track.X;
                var _b = _table_track.Y;
                var _x = _r - _d;
                var _y = _b - _d;
                if ((pos.X > _x) && (pos.X < _r) && (pos.Y > _y) && (pos.Y < _b)) {
                    this.TrackOffsetX = pos.X - _r;
                    this.TrackOffsetY = pos.Y - _b;
                    return true;
                }
                return false;
            }
        } else {
            if (word_control.MobileTouchManager) {
                var _invert = global_MatrixTransformer.Invert(this.TableMatrix);
                var _posx = _invert.TransformPointX(pos.X, pos.Y);
                var _posy = _invert.TransformPointY(pos.X, pos.Y);
                var _move_point = word_control.MobileTouchManager.TableMovePoint;
                if (_move_point == null || pos.Page != _table_track.PageNum) {
                    return false;
                }
                var _koef = g_dKoef_pix_to_mm * 100 / word_control.m_nZoomValue;
                var _eps = word_control.MobileTouchManager.TrackTargetEps * _koef;
                var _offset1 = word_control.MobileTouchManager.TableRulersRectOffset * _koef;
                var _offset2 = _offset1 + word_control.MobileTouchManager.TableRulersRectSize * _koef;
                if ((_posx >= (_move_point.X - _offset2 - _eps)) && (_posx <= (_move_point.X - _offset1 + _eps)) && (_posy >= (_move_point.Y - _offset2 - _eps)) && (_posy <= (_move_point.Y - _offset1 + _eps))) {
                    this.TrackTablePos = 0;
                    return true;
                }
                return false;
            }
            var _invert = global_MatrixTransformer.Invert(this.TableMatrix);
            var _posx = _invert.TransformPointX(pos.X, pos.Y);
            var _posy = _invert.TransformPointY(pos.X, pos.Y);
            switch (this.TrackTablePos) {
            case 1:
                var _x = _table_track.X + _table_track.W;
                var _b = _table_track.Y;
                var _y = _b - _d;
                var _r = _x + _d;
                if ((_posx > _x) && (_posx < _r) && (_posy > _y) && (_posy < _b)) {
                    this.TrackOffsetX = _posx - _x;
                    this.TrackOffsetY = _posy - _b;
                    return true;
                }
                return false;
            case 2:
                var _x = _table_track.X + _table_track.W;
                var _y = _table_track.Y + _table_track.H;
                var _r = _x + _d;
                var _b = _y + _d;
                if ((_posx > _x) && (_posx < _r) && (_posy > _y) && (_posy < _b)) {
                    this.TrackOffsetX = _posx - _x;
                    this.TrackOffsetY = _posy - _y;
                    return true;
                }
                return false;
            case 3:
                var _r = _table_track.X;
                var _x = _r - _d;
                var _y = _table_track.Y + _table_track.H;
                var _b = _y + _d;
                if ((_posx > _x) && (_posx < _r) && (_posy > _y) && (_posy < _b)) {
                    this.TrackOffsetX = _posx - _r;
                    this.TrackOffsetY = _posy - _y;
                    return true;
                }
                return false;
            case 0:
                default:
                var _r = _table_track.X;
                var _b = _table_track.Y;
                var _x = _r - _d;
                var _y = _b - _d;
                if ((_posx > _x) && (_posx < _r) && (_posy > _y) && (_posy < _b)) {
                    this.TrackOffsetX = _posx - _r;
                    this.TrackOffsetY = _posy - _b;
                    return true;
                }
                return false;
            }
        }
        return false;
    };
    this.checkMouseUp = function (X, Y, word_control) {
        this.bIsTracked = false;
        if (null == this.TableOutline || (true === this.IsChangeSmall) || word_control.m_oApi.isViewMode) {
            return false;
        }
        var _d = 13 * g_dKoef_pix_to_mm * 100 / word_control.m_nZoomValue;
        var _outline = this.TableOutline;
        var _table = _outline.Table;
        _table.Cursor_MoveToStartPos();
        _table.Document_SetThisElementCurrent();
        if (!_table.Is_Inline()) {
            var pos;
            switch (this.TrackTablePos) {
            case 1:
                var _w_pix = this.TableOutline.W * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
                pos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X - _w_pix, Y);
                break;
            case 2:
                var _w_pix = this.TableOutline.W * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
                var _h_pix = this.TableOutline.H * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
                pos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X - _w_pix, Y - _h_pix);
                break;
            case 3:
                var _h_pix = this.TableOutline.H * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
                pos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X, Y - _h_pix);
                break;
            case 0:
                default:
                pos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X, Y);
                break;
            }
            var NearestPos = word_control.m_oLogicDocument.Get_NearestPos(pos.Page, pos.X - this.TrackOffsetX, pos.Y - this.TrackOffsetY);
            _table.Move(pos.X - this.TrackOffsetX, pos.Y - this.TrackOffsetY, pos.Page, NearestPos);
            _outline.X = pos.X - this.TrackOffsetX;
            _outline.Y = pos.Y - this.TrackOffsetY;
            _outline.PageNum = pos.Page;
        } else {
            if (null != this.InlinePos) {
                _table.Move(this.InlinePos.X, this.InlinePos.Y, this.InlinePos.Page, this.InlinePos);
            }
        }
    };
    this.checkMouseMove = function (X, Y, word_control) {
        if (null == this.TableOutline) {
            return false;
        }
        if (true === this.IsChangeSmall) {
            var _pos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X, Y);
            var _dist = 15 * g_dKoef_pix_to_mm * 100 / word_control.m_nZoomValue;
            if ((Math.abs(_pos.X - this.ChangeSmallPoint.X) < _dist) && (Math.abs(_pos.Y - this.ChangeSmallPoint.Y) < _dist) && (_pos.Page == this.ChangeSmallPoint.Page)) {
                this.CurPos = {
                    X: this.ChangeSmallPoint.X,
                    Y: this.ChangeSmallPoint.Y,
                    Page: this.ChangeSmallPoint.Page
                };
                switch (this.TrackTablePos) {
                case 1:
                    this.CurPos.X -= this.TableOutline.W;
                    break;
                case 2:
                    this.CurPos.X -= this.TableOutline.W;
                    this.CurPos.Y -= this.TableOutline.H;
                    break;
                case 3:
                    this.CurPos.Y -= this.TableOutline.H;
                    break;
                case 0:
                    default:
                    break;
                }
                this.CurPos.X -= this.TrackOffsetX;
                this.CurPos.Y -= this.TrackOffsetY;
                return;
            }
            this.IsChangeSmall = false;
            this.TableOutline.Table.Selection_Remove();
            editor.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
        }
        var _d = 13 * g_dKoef_pix_to_mm * 100 / word_control.m_nZoomValue;
        switch (this.TrackTablePos) {
        case 1:
            var _w_pix = this.TableOutline.W * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
            this.CurPos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X - _w_pix, Y);
            break;
        case 2:
            var _w_pix = this.TableOutline.W * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
            var _h_pix = this.TableOutline.H * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
            this.CurPos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X - _w_pix, Y - _h_pix);
            break;
        case 3:
            var _h_pix = this.TableOutline.H * g_dKoef_mm_to_pix * word_control.m_nZoomValue / 100;
            this.CurPos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X, Y - _h_pix);
            break;
        case 0:
            default:
            this.CurPos = word_control.m_oDrawingDocument.ConvertCoordsFromCursor2(X, Y);
            break;
        }
        this.CurPos.X -= this.TrackOffsetX;
        this.CurPos.Y -= this.TrackOffsetY;
    };
    this.CheckStartTrack = function (word_control, transform) {
        this.TableMatrix = null;
        if (transform) {
            this.TableMatrix = transform.CreateDublicate();
        }
        if (!this.TableMatrix || global_MatrixTransformer.IsIdentity(this.TableMatrix)) {
            var pos = word_control.m_oDrawingDocument.ConvertCoordsToCursor(this.TableOutline.X, this.TableOutline.Y, this.TableOutline.PageNum, true);
            var _x0 = word_control.m_oEditor.AbsolutePosition.L;
            var _y0 = word_control.m_oEditor.AbsolutePosition.T;
            if (pos.X < _x0 && pos.Y < _y0) {
                this.TrackTablePos = 2;
            } else {
                if (pos.X < _x0) {
                    this.TrackTablePos = 1;
                } else {
                    if (pos.Y < _y0) {
                        this.TrackTablePos = 3;
                    } else {
                        this.TrackTablePos = 0;
                    }
                }
            }
        } else {
            var _x = this.TableOutline.X;
            var _y = this.TableOutline.Y;
            var _r = _x + this.TableOutline.W;
            var _b = _y + this.TableOutline.H;
            var x0 = transform.TransformPointX(_x, _y);
            var y0 = transform.TransformPointY(_x, _y);
            var x1 = transform.TransformPointX(_r, _y);
            var y1 = transform.TransformPointY(_r, _y);
            var x2 = transform.TransformPointX(_r, _b);
            var y2 = transform.TransformPointY(_r, _b);
            var x3 = transform.TransformPointX(_x, _b);
            var y3 = transform.TransformPointY(_x, _b);
            var _x0 = word_control.m_oEditor.AbsolutePosition.L * g_dKoef_mm_to_pix;
            var _y0 = word_control.m_oEditor.AbsolutePosition.T * g_dKoef_mm_to_pix;
            var _x1 = word_control.m_oEditor.AbsolutePosition.R * g_dKoef_mm_to_pix;
            var _y1 = word_control.m_oEditor.AbsolutePosition.B * g_dKoef_mm_to_pix;
            var pos0 = word_control.m_oDrawingDocument.ConvertCoordsToCursor(x0, y0, this.TableOutline.PageNum, true);
            if (pos0.X > _x0 && pos0.X < _x1 && pos0.Y > _y0 && pos0.Y < _y1) {
                this.TrackTablePos = 0;
                return;
            }
            pos0 = word_control.m_oDrawingDocument.ConvertCoordsToCursor(x1, y1, this.TableOutline.PageNum, true);
            if (pos0.X > _x0 && pos0.X < _x1 && pos0.Y > _y0 && pos0.Y < _y1) {
                this.TrackTablePos = 1;
                return;
            }
            pos0 = word_control.m_oDrawingDocument.ConvertCoordsToCursor(x3, y3, this.TableOutline.PageNum, true);
            if (pos0.X > _x0 && pos0.X < _x1 && pos0.Y > _y0 && pos0.Y < _y1) {
                this.TrackTablePos = 3;
                return;
            }
            pos0 = word_control.m_oDrawingDocument.ConvertCoordsToCursor(x2, y2, this.TableOutline.PageNum, true);
            if (pos0.X > _x0 && pos0.X < _x1 && pos0.Y > _y0 && pos0.Y < _y1) {
                this.TrackTablePos = 2;
                return;
            }
            this.TrackTablePos = 0;
        }
    };
}
function CCacheImage() {
    this.image = null;
    this.image_locked = 0;
    this.image_unusedCount = 0;
}
function CCacheManager() {
    this.arrayImages = [];
    this.arrayCount = 0;
    this.countValidImage = 1;
    this.CheckImagesForNeed = function () {
        for (var i = 0; i < this.arrayCount; ++i) {
            if ((this.arrayImages[i].image_locked == 0) && (this.arrayImages[i].image_unusedCount >= this.countValidImage)) {
                delete this.arrayImages[i].image;
                this.arrayImages.splice(i, 1);
                --i;
                --this.arrayCount;
            }
        }
    };
    this.UnLock = function (_cache_image) {
        if (null == _cache_image) {
            return;
        }
        _cache_image.image_locked = 0;
        _cache_image.image_unusedCount = 0;
    };
    this.Lock = function (_w, _h) {
        for (var i = 0; i < this.arrayCount; ++i) {
            if (this.arrayImages[i].image_locked) {
                continue;
            }
            var _wI = this.arrayImages[i].image.width;
            var _hI = this.arrayImages[i].image.height;
            if ((_wI == _w) && (_hI == _h)) {
                this.arrayImages[i].image_locked = 1;
                this.arrayImages[i].image_unusedCount = 0;
                this.arrayImages[i].image.ctx.globalAlpha = 1;
                this.arrayImages[i].image.ctx.setTransform(1, 0, 0, 1, 0, 0);
                this.arrayImages[i].image.ctx.fillStyle = "#ffffff";
                this.arrayImages[i].image.ctx.fillRect(0, 0, _w, _h);
                return this.arrayImages[i];
            }
            this.arrayImages[i].image_unusedCount++;
        }
        this.CheckImagesForNeed();
        var index = this.arrayCount;
        this.arrayCount++;
        this.arrayImages[index] = new CCacheImage();
        this.arrayImages[index].image = document.createElement("canvas");
        this.arrayImages[index].image.width = _w;
        this.arrayImages[index].image.height = _h;
        this.arrayImages[index].image.ctx = this.arrayImages[index].image.getContext("2d");
        this.arrayImages[index].image.ctx.globalAlpha = 1;
        this.arrayImages[index].image.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.arrayImages[index].image.ctx.fillStyle = "#ffffff";
        this.arrayImages[index].image.ctx.fillRect(0, 0, _w, _h);
        this.arrayImages[index].image_locked = 1;
        this.arrayImages[index].image_unusedCount = 0;
        return this.arrayImages[index];
    };
}
function _rect() {
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
}
function CDrawingPage() {
    this.left = 0;
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this.cachedImage = null;
}
function CPage() {
    this.width_mm = 210;
    this.height_mm = 297;
    this.margin_left = 0;
    this.margin_top = 0;
    this.margin_right = 0;
    this.margin_bottom = 0;
    this.pageIndex = -1;
    this.searchingArray = [];
    this.selectionArray = [];
    this.drawingPage = new CDrawingPage();
    this.Draw = function (context, xDst, yDst, wDst, hDst, contextW, contextH) {
        if (null != this.drawingPage.cachedImage) {
            context.strokeStyle = "#81878F";
            context.strokeRect(xDst, yDst, wDst, hDst);
            context.drawImage(this.drawingPage.cachedImage.image, xDst, yDst, wDst, hDst);
        } else {
            context.fillStyle = "#ffffff";
            context.strokeStyle = "#81878F";
            context.strokeRect(xDst, yDst, wDst, hDst);
            context.fillRect(xDst, yDst, wDst, hDst);
        }
    };
    this.DrawSelection = function (overlay, xDst, yDst, wDst, hDst, TextMatrix) {
        var dKoefX = wDst / this.width_mm;
        var dKoefY = hDst / this.height_mm;
        var selectionArray = this.selectionArray;
        if (null == TextMatrix || global_MatrixTransformer.IsIdentity(TextMatrix)) {
            for (var i = 0; i < selectionArray.length; i++) {
                var r = selectionArray[i];
                var _x = ((xDst + dKoefX * r.x) >> 0) - 0.5;
                var _y = ((yDst + dKoefY * r.y) >> 0) - 0.5;
                var _w = (dKoefX * r.w + 1) >> 0;
                var _h = (dKoefY * r.h + 1) >> 0;
                if (_x < overlay.min_x) {
                    overlay.min_x = _x;
                }
                if ((_x + _w) > overlay.max_x) {
                    overlay.max_x = _x + _w;
                }
                if (_y < overlay.min_y) {
                    overlay.min_y = _y;
                }
                if ((_y + _h) > overlay.max_y) {
                    overlay.max_y = _y + _h;
                }
                overlay.m_oContext.rect(_x, _y, _w, _h);
            }
        } else {
            for (var i = 0; i < selectionArray.length; i++) {
                var r = selectionArray[i];
                var _x1 = TextMatrix.TransformPointX(r.x, r.y);
                var _y1 = TextMatrix.TransformPointY(r.x, r.y);
                var _x2 = TextMatrix.TransformPointX(r.x + r.w, r.y);
                var _y2 = TextMatrix.TransformPointY(r.x + r.w, r.y);
                var _x3 = TextMatrix.TransformPointX(r.x + r.w, r.y + r.h);
                var _y3 = TextMatrix.TransformPointY(r.x + r.w, r.y + r.h);
                var _x4 = TextMatrix.TransformPointX(r.x, r.y + r.h);
                var _y4 = TextMatrix.TransformPointY(r.x, r.y + r.h);
                var x1 = xDst + dKoefX * _x1;
                var y1 = yDst + dKoefY * _y1;
                var x2 = xDst + dKoefX * _x2;
                var y2 = yDst + dKoefY * _y2;
                var x3 = xDst + dKoefX * _x3;
                var y3 = yDst + dKoefY * _y3;
                var x4 = xDst + dKoefX * _x4;
                var y4 = yDst + dKoefY * _y4;
                overlay.CheckPoint(x1, y1);
                overlay.CheckPoint(x2, y2);
                overlay.CheckPoint(x3, y3);
                overlay.CheckPoint(x4, y4);
                var ctx = overlay.m_oContext;
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.lineTo(x3, y3);
                ctx.lineTo(x4, y4);
                ctx.closePath();
            }
        }
    };
    this.DrawSearch = function (overlay, xDst, yDst, wDst, hDst, drDoc) {
        var dKoefX = wDst / this.width_mm;
        var dKoefY = hDst / this.height_mm;
        var ret = this.drawInHdrFtr(overlay, xDst, yDst, wDst, hDst, dKoefX, dKoefY, drDoc._search_HdrFtr_All);
        if (!ret && this.pageIndex != 0) {
            ret = this.drawInHdrFtr(overlay, xDst, yDst, wDst, hDst, dKoefX, dKoefY, drDoc._search_HdrFtr_All_no_First);
        }
        if (!ret && this.pageIndex == 0) {
            ret = this.drawInHdrFtr(overlay, xDst, yDst, wDst, hDst, dKoefX, dKoefY, drDoc._search_HdrFtr_First);
        }
        if (!ret && (this.pageIndex & 1) == 1) {
            ret = this.drawInHdrFtr(overlay, xDst, yDst, wDst, hDst, dKoefX, dKoefY, drDoc._search_HdrFtr_Even);
        }
        if (!ret && (this.pageIndex & 1) == 0) {
            ret = this.drawInHdrFtr(overlay, xDst, yDst, wDst, hDst, dKoefX, dKoefY, drDoc._search_HdrFtr_Odd);
        }
        if (!ret && (this.pageIndex != 0)) {
            ret = this.drawInHdrFtr(overlay, xDst, yDst, wDst, hDst, dKoefX, dKoefY, drDoc._search_HdrFtr_Odd_no_First);
        }
        var ctx = overlay.m_oContext;
        for (var i = 0; i < this.searchingArray.length; i++) {
            var place = this.searchingArray[i];
            if (!place.Transform) {
                if (undefined === place.Ex) {
                    var _x = parseInt(xDst + dKoefX * place.X) - 0.5;
                    var _y = parseInt(yDst + dKoefY * place.Y) - 0.5;
                    var _w = parseInt(dKoefX * place.W) + 1;
                    var _h = parseInt(dKoefY * place.H) + 1;
                    if (_x < overlay.min_x) {
                        overlay.min_x = _x;
                    }
                    if ((_x + _w) > overlay.max_x) {
                        overlay.max_x = _x + _w;
                    }
                    if (_y < overlay.min_y) {
                        overlay.min_y = _y;
                    }
                    if ((_y + _h) > overlay.max_y) {
                        overlay.max_y = _y + _h;
                    }
                    ctx.rect(_x, _y, _w, _h);
                } else {
                    var _x1 = parseInt(xDst + dKoefX * place.X);
                    var _y1 = parseInt(yDst + dKoefY * place.Y);
                    var x2 = place.X + place.W * place.Ex;
                    var y2 = place.Y + place.W * place.Ey;
                    var _x2 = parseInt(xDst + dKoefX * x2);
                    var _y2 = parseInt(yDst + dKoefY * y2);
                    var x3 = x2 - place.H * place.Ey;
                    var y3 = y2 + place.H * place.Ex;
                    var _x3 = parseInt(xDst + dKoefX * x3);
                    var _y3 = parseInt(yDst + dKoefY * y3);
                    var x4 = place.X - place.H * place.Ey;
                    var y4 = place.Y + place.H * place.Ex;
                    var _x4 = parseInt(xDst + dKoefX * x4);
                    var _y4 = parseInt(yDst + dKoefY * y4);
                    overlay.CheckPoint(_x1, _y1);
                    overlay.CheckPoint(_x2, _y2);
                    overlay.CheckPoint(_x3, _y3);
                    overlay.CheckPoint(_x4, _y4);
                    ctx.moveTo(_x1, _y1);
                    ctx.lineTo(_x2, _y2);
                    ctx.lineTo(_x3, _y3);
                    ctx.lineTo(_x4, _y4);
                    ctx.lineTo(_x1, _y1);
                }
            } else {
                var _tr = place.Transform;
                if (undefined === place.Ex) {
                    var _x1 = xDst + dKoefX * _tr.TransformPointX(place.X, place.Y);
                    var _y1 = yDst + dKoefY * _tr.TransformPointY(place.X, place.Y);
                    var _x2 = xDst + dKoefX * _tr.TransformPointX(place.X + place.W, place.Y);
                    var _y2 = yDst + dKoefY * _tr.TransformPointY(place.X + place.W, place.Y);
                    var _x3 = xDst + dKoefX * _tr.TransformPointX(place.X + place.W, place.Y + place.H);
                    var _y3 = yDst + dKoefY * _tr.TransformPointY(place.X + place.W, place.Y + place.H);
                    var _x4 = xDst + dKoefX * _tr.TransformPointX(place.X, place.Y + place.H);
                    var _y4 = yDst + dKoefY * _tr.TransformPointY(place.X, place.Y + place.H);
                    overlay.CheckPoint(_x1, _y1);
                    overlay.CheckPoint(_x2, _y2);
                    overlay.CheckPoint(_x3, _y3);
                    overlay.CheckPoint(_x4, _y4);
                    ctx.moveTo(_x1, _y1);
                    ctx.lineTo(_x2, _y2);
                    ctx.lineTo(_x3, _y3);
                    ctx.lineTo(_x4, _y4);
                    ctx.lineTo(_x1, _y1);
                } else {
                    var x2 = place.X + place.W * place.Ex;
                    var y2 = place.Y + place.W * place.Ey;
                    var x3 = x2 - place.H * place.Ey;
                    var y3 = y2 + place.H * place.Ex;
                    var x4 = place.X - place.H * place.Ey;
                    var y4 = place.Y + place.H * place.Ex;
                    var _x1 = xDst + dKoefX * _tr.TransformPointX(place.X, place.Y);
                    var _y1 = yDst + dKoefY * _tr.TransformPointY(place.X, place.Y);
                    var _x2 = xDst + dKoefX * _tr.TransformPointX(x2, y2);
                    var _y2 = yDst + dKoefY * _tr.TransformPointY(x2, y2);
                    var _x3 = xDst + dKoefX * _tr.TransformPointX(x3, y3);
                    var _y3 = yDst + dKoefY * _tr.TransformPointY(x3, y3);
                    var _x4 = xDst + dKoefX * _tr.TransformPointX(x4, y4);
                    var _y4 = yDst + dKoefY * _tr.TransformPointY(x4, y4);
                    overlay.CheckPoint(_x1, _y1);
                    overlay.CheckPoint(_x2, _y2);
                    overlay.CheckPoint(_x3, _y3);
                    overlay.CheckPoint(_x4, _y4);
                    ctx.moveTo(_x1, _y1);
                    ctx.lineTo(_x2, _y2);
                    ctx.lineTo(_x3, _y3);
                    ctx.lineTo(_x4, _y4);
                    ctx.lineTo(_x1, _y1);
                }
            }
        }
    };
    this.drawInHdrFtr = function (overlay, xDst, yDst, wDst, hDst, dKoefX, dKoefY, arr) {
        var _c = arr.length;
        if (0 == _c) {
            return false;
        }
        var ctx = overlay.m_oContext;
        for (var i = 0; i < _c; i++) {
            var place = arr[i];
            if (!place.Transform) {
                if (undefined === place.Ex) {
                    var _x = parseInt(xDst + dKoefX * place.X) - 0.5;
                    var _y = parseInt(yDst + dKoefY * place.Y) - 0.5;
                    var _w = parseInt(dKoefX * place.W) + 1;
                    var _h = parseInt(dKoefY * place.H) + 1;
                    if (_x < overlay.min_x) {
                        overlay.min_x = _x;
                    }
                    if ((_x + _w) > overlay.max_x) {
                        overlay.max_x = _x + _w;
                    }
                    if (_y < overlay.min_y) {
                        overlay.min_y = _y;
                    }
                    if ((_y + _h) > overlay.max_y) {
                        overlay.max_y = _y + _h;
                    }
                    ctx.rect(_x, _y, _w, _h);
                } else {
                    var _x1 = parseInt(xDst + dKoefX * place.X);
                    var _y1 = parseInt(yDst + dKoefY * place.Y);
                    var x2 = place.X + place.W * place.Ex;
                    var y2 = place.Y + place.W * place.Ey;
                    var _x2 = parseInt(xDst + dKoefX * x2);
                    var _y2 = parseInt(yDst + dKoefY * y2);
                    var x3 = x2 - place.H * place.Ey;
                    var y3 = y2 + place.H * place.Ex;
                    var _x3 = parseInt(xDst + dKoefX * x3);
                    var _y3 = parseInt(yDst + dKoefY * y3);
                    var x4 = place.X - place.H * place.Ey;
                    var y4 = place.Y + place.H * place.Ex;
                    var _x4 = parseInt(xDst + dKoefX * x4);
                    var _y4 = parseInt(yDst + dKoefY * y4);
                    overlay.CheckPoint(_x1, _y1);
                    overlay.CheckPoint(_x2, _y2);
                    overlay.CheckPoint(_x3, _y3);
                    overlay.CheckPoint(_x4, _y4);
                    ctx.moveTo(_x1, _y1);
                    ctx.lineTo(_x2, _y2);
                    ctx.lineTo(_x3, _y3);
                    ctx.lineTo(_x4, _y4);
                    ctx.lineTo(_x1, _y1);
                }
            } else {
                var _tr = place.Transform;
                if (undefined === place.Ex) {
                    var _x1 = xDst + dKoefX * _tr.TransformPointX(place.X, place.Y);
                    var _y1 = yDst + dKoefY * _tr.TransformPointY(place.X, place.Y);
                    var _x2 = xDst + dKoefX * _tr.TransformPointX(place.X + place.W, place.Y);
                    var _y2 = yDst + dKoefY * _tr.TransformPointY(place.X + place.W, place.Y);
                    var _x3 = xDst + dKoefX * _tr.TransformPointX(place.X + place.W, place.Y + place.H);
                    var _y3 = yDst + dKoefY * _tr.TransformPointY(place.X + place.W, place.Y + place.H);
                    var _x4 = xDst + dKoefX * _tr.TransformPointX(place.X, place.Y + place.H);
                    var _y4 = yDst + dKoefY * _tr.TransformPointY(place.X, place.Y + place.H);
                    overlay.CheckPoint(_x1, _y1);
                    overlay.CheckPoint(_x2, _y2);
                    overlay.CheckPoint(_x3, _y3);
                    overlay.CheckPoint(_x4, _y4);
                    ctx.moveTo(_x1, _y1);
                    ctx.lineTo(_x2, _y2);
                    ctx.lineTo(_x3, _y3);
                    ctx.lineTo(_x4, _y4);
                    ctx.lineTo(_x1, _y1);
                } else {
                    var x2 = place.X + place.W * place.Ex;
                    var y2 = place.Y + place.W * place.Ey;
                    var x3 = x2 - place.H * place.Ey;
                    var y3 = y2 + place.H * place.Ex;
                    var x4 = place.X - place.H * place.Ey;
                    var y4 = place.Y + place.H * place.Ex;
                    var _x1 = xDst + dKoefX * _tr.TransformPointX(place.X, place.Y);
                    var _y1 = yDst + dKoefY * _tr.TransformPointY(place.X, place.Y);
                    var _x2 = xDst + dKoefX * _tr.TransformPointX(x2, y2);
                    var _y2 = yDst + dKoefY * _tr.TransformPointY(x2, y2);
                    var _x3 = xDst + dKoefX * _tr.TransformPointX(x3, y3);
                    var _y3 = yDst + dKoefY * _tr.TransformPointY(x3, y3);
                    var _x4 = xDst + dKoefX * _tr.TransformPointX(x4, y4);
                    var _y4 = yDst + dKoefY * _tr.TransformPointY(x4, y4);
                    overlay.CheckPoint(_x1, _y1);
                    overlay.CheckPoint(_x2, _y2);
                    overlay.CheckPoint(_x3, _y3);
                    overlay.CheckPoint(_x4, _y4);
                    ctx.moveTo(_x1, _y1);
                    ctx.lineTo(_x2, _y2);
                    ctx.lineTo(_x3, _y3);
                    ctx.lineTo(_x4, _y4);
                    ctx.lineTo(_x1, _y1);
                }
            }
        }
        return true;
    };
    this.DrawSearchCur1 = function (overlay, xDst, yDst, wDst, hDst, place) {
        var dKoefX = wDst / this.width_mm;
        var dKoefY = hDst / this.height_mm;
        var ctx = overlay.m_oContext;
        if (!place.Transform) {
            if (undefined === place.Ex) {
                var _x = parseInt(xDst + dKoefX * place.X) - 0.5;
                var _y = parseInt(yDst + dKoefY * place.Y) - 0.5;
                var _w = parseInt(dKoefX * place.W) + 1;
                var _h = parseInt(dKoefY * place.H) + 1;
                if (_x < overlay.min_x) {
                    overlay.min_x = _x;
                }
                if ((_x + _w) > overlay.max_x) {
                    overlay.max_x = _x + _w;
                }
                if (_y < overlay.min_y) {
                    overlay.min_y = _y;
                }
                if ((_y + _h) > overlay.max_y) {
                    overlay.max_y = _y + _h;
                }
                ctx.rect(_x, _y, _w, _h);
            } else {
                var _x1 = parseInt(xDst + dKoefX * place.X);
                var _y1 = parseInt(yDst + dKoefY * place.Y);
                var x2 = place.X + place.W * place.Ex;
                var y2 = place.Y + place.W * place.Ey;
                var _x2 = parseInt(xDst + dKoefX * x2);
                var _y2 = parseInt(yDst + dKoefY * y2);
                var x3 = x2 - place.H * place.Ey;
                var y3 = y2 + place.H * place.Ex;
                var _x3 = parseInt(xDst + dKoefX * x3);
                var _y3 = parseInt(yDst + dKoefY * y3);
                var x4 = place.X - place.H * place.Ey;
                var y4 = place.Y + place.H * place.Ex;
                var _x4 = parseInt(xDst + dKoefX * x4);
                var _y4 = parseInt(yDst + dKoefY * y4);
                overlay.CheckPoint(_x1, _y1);
                overlay.CheckPoint(_x2, _y2);
                overlay.CheckPoint(_x3, _y3);
                overlay.CheckPoint(_x4, _y4);
                ctx.moveTo(_x1, _y1);
                ctx.lineTo(_x2, _y2);
                ctx.lineTo(_x3, _y3);
                ctx.lineTo(_x4, _y4);
                ctx.lineTo(_x1, _y1);
            }
        } else {
            var _tr = place.Transform;
            if (undefined === place.Ex) {
                var _x1 = xDst + dKoefX * _tr.TransformPointX(place.X, place.Y);
                var _y1 = yDst + dKoefY * _tr.TransformPointY(place.X, place.Y);
                var _x2 = xDst + dKoefX * _tr.TransformPointX(place.X + place.W, place.Y);
                var _y2 = yDst + dKoefY * _tr.TransformPointY(place.X + place.W, place.Y);
                var _x3 = xDst + dKoefX * _tr.TransformPointX(place.X + place.W, place.Y + place.H);
                var _y3 = yDst + dKoefY * _tr.TransformPointY(place.X + place.W, place.Y + place.H);
                var _x4 = xDst + dKoefX * _tr.TransformPointX(place.X, place.Y + place.H);
                var _y4 = yDst + dKoefY * _tr.TransformPointY(place.X, place.Y + place.H);
                overlay.CheckPoint(_x1, _y1);
                overlay.CheckPoint(_x2, _y2);
                overlay.CheckPoint(_x3, _y3);
                overlay.CheckPoint(_x4, _y4);
                ctx.moveTo(_x1, _y1);
                ctx.lineTo(_x2, _y2);
                ctx.lineTo(_x3, _y3);
                ctx.lineTo(_x4, _y4);
                ctx.lineTo(_x1, _y1);
            } else {
                var x2 = place.X + place.W * place.Ex;
                var y2 = place.Y + place.W * place.Ey;
                var x3 = x2 - place.H * place.Ey;
                var y3 = y2 + place.H * place.Ex;
                var x4 = place.X - place.H * place.Ey;
                var y4 = place.Y + place.H * place.Ex;
                var _x1 = xDst + dKoefX * _tr.TransformPointX(place.X, place.Y);
                var _y1 = yDst + dKoefY * _tr.TransformPointY(place.X, place.Y);
                var _x2 = xDst + dKoefX * _tr.TransformPointX(x2, y2);
                var _y2 = yDst + dKoefY * _tr.TransformPointY(x2, y2);
                var _x3 = xDst + dKoefX * _tr.TransformPointX(x3, y3);
                var _y3 = yDst + dKoefY * _tr.TransformPointY(x3, y3);
                var _x4 = xDst + dKoefX * _tr.TransformPointX(x4, y4);
                var _y4 = yDst + dKoefY * _tr.TransformPointY(x4, y4);
                overlay.CheckPoint(_x1, _y1);
                overlay.CheckPoint(_x2, _y2);
                overlay.CheckPoint(_x3, _y3);
                overlay.CheckPoint(_x4, _y4);
                ctx.moveTo(_x1, _y1);
                ctx.lineTo(_x2, _y2);
                ctx.lineTo(_x3, _y3);
                ctx.lineTo(_x4, _y4);
                ctx.lineTo(_x1, _y1);
            }
        }
    };
    this.DrawSearchCur = function (overlay, xDst, yDst, wDst, hDst, navi) {
        var dKoefX = wDst / this.width_mm;
        var dKoefY = hDst / this.height_mm;
        var places = navi.Place;
        var len = places.length;
        var ctx = overlay.m_oContext;
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "rgba(51,102,204,255)";
        for (var i = 0; i < len; i++) {
            var place = places[i];
            if (undefined === place.Ex) {
                var _x = parseInt(xDst + dKoefX * place.X) - 0.5;
                var _y = parseInt(yDst + dKoefY * place.Y) - 0.5;
                var _w = parseInt(dKoefX * place.W) + 1;
                var _h = parseInt(dKoefY * place.H) + 1;
                if (_x < overlay.min_x) {
                    overlay.min_x = _x;
                }
                if ((_x + _w) > overlay.max_x) {
                    overlay.max_x = _x + _w;
                }
                if (_y < overlay.min_y) {
                    overlay.min_y = _y;
                }
                if ((_y + _h) > overlay.max_y) {
                    overlay.max_y = _y + _h;
                }
                ctx.rect(_x, _y, _w, _h);
            } else {
                var _x1 = parseInt(xDst + dKoefX * place.X);
                var _y1 = parseInt(yDst + dKoefY * place.Y);
                var x2 = place.X + place.W * place.Ex;
                var y2 = place.Y + place.W * place.Ey;
                var _x2 = parseInt(xDst + dKoefX * x2);
                var _y2 = parseInt(yDst + dKoefY * y2);
                var x3 = x2 - place.H * place.Ey;
                var y3 = y2 + place.H * place.Ex;
                var _x3 = parseInt(xDst + dKoefX * x3);
                var _y3 = parseInt(yDst + dKoefY * y3);
                var x4 = place.X - place.H * place.Ey;
                var y4 = place.Y + place.H * place.Ex;
                var _x4 = parseInt(xDst + dKoefX * x4);
                var _y4 = parseInt(yDst + dKoefY * y4);
                overlay.CheckPoint(_x1, _y1);
                overlay.CheckPoint(_x2, _y2);
                overlay.CheckPoint(_x3, _y3);
                overlay.CheckPoint(_x4, _y4);
                ctx.moveTo(_x1, _y1);
                ctx.lineTo(_x2, _y2);
                ctx.lineTo(_x3, _y3);
                ctx.lineTo(_x4, _y4);
                ctx.lineTo(_x1, _y1);
            }
        }
        ctx.fill();
        ctx.globalAlpha = 1;
    };
    this.DrawTableOutline = function (overlay, xDst, yDst, wDst, hDst, table_outline_dr) {
        var transform = table_outline_dr.TableMatrix;
        if (null == transform || transform.IsIdentity2()) {
            var dKoefX = wDst / this.width_mm;
            var dKoefY = hDst / this.height_mm;
            var _offX = (null == transform) ? 0 : transform.tx;
            var _offY = (null == transform) ? 0 : transform.ty;
            var _x = 0;
            var _y = 0;
            switch (table_outline_dr.TrackTablePos) {
            case 1:
                _x = parseInt(xDst + dKoefX * (table_outline_dr.TableOutline.X + table_outline_dr.TableOutline.W + _offX));
                _y = parseInt(yDst + dKoefY * (table_outline_dr.TableOutline.Y + _offY)) - 13;
                break;
            case 2:
                _x = parseInt(xDst + dKoefX * (table_outline_dr.TableOutline.X + table_outline_dr.TableOutline.W + _offX));
                _y = parseInt(yDst + dKoefY * (table_outline_dr.TableOutline.Y + table_outline_dr.TableOutline.H + _offY));
                break;
            case 3:
                _x = parseInt(xDst + dKoefX * (table_outline_dr.TableOutline.X + _offX)) - 13;
                _y = parseInt(yDst + dKoefY * (table_outline_dr.TableOutline.Y + table_outline_dr.TableOutline.H + _offY));
                break;
            case 0:
                default:
                _x = parseInt(xDst + dKoefX * (table_outline_dr.TableOutline.X + _offX)) - 13;
                _y = parseInt(yDst + dKoefY * (table_outline_dr.TableOutline.Y + _offY)) - 13;
                break;
            }
            var _w = 13;
            var _h = 13;
            if (_x < overlay.min_x) {
                overlay.min_x = _x;
            }
            if ((_x + _w) > overlay.max_x) {
                overlay.max_x = _x + _w;
            }
            if (_y < overlay.min_y) {
                overlay.min_y = _y;
            }
            if ((_y + _h) > overlay.max_y) {
                overlay.max_y = _y + _h;
            }
            overlay.m_oContext.drawImage(table_outline_dr.image, _x, _y);
        } else {
            var ctx = overlay.m_oContext;
            var _ft = new CMatrix();
            _ft.sx = transform.sx;
            _ft.shx = transform.shx;
            _ft.shy = transform.shy;
            _ft.sy = transform.sy;
            _ft.tx = transform.tx;
            _ft.ty = transform.ty;
            var coords = new CMatrix();
            coords.sx = wDst / this.width_mm;
            coords.sy = hDst / this.height_mm;
            coords.tx = xDst;
            coords.ty = yDst;
            global_MatrixTransformer.MultiplyAppend(_ft, coords);
            ctx.transform(_ft.sx, _ft.shy, _ft.shx, _ft.sy, _ft.tx, _ft.ty);
            var _x = 0;
            var _y = 0;
            var _w = 13 / coords.sx;
            var _h = 13 / coords.sy;
            switch (table_outline_dr.TrackTablePos) {
            case 1:
                _x = (table_outline_dr.TableOutline.X + table_outline_dr.TableOutline.W);
                _y = (table_outline_dr.TableOutline.Y - _h);
                break;
            case 2:
                _x = (table_outline_dr.TableOutline.X + table_outline_dr.TableOutline.W);
                _y = (table_outline_dr.TableOutline.Y + table_outline_dr.TableOutline.H);
                break;
            case 3:
                _x = (table_outline_dr.TableOutline.X - _w);
                _y = (table_outline_dr.TableOutline.Y + table_outline_dr.TableOutline.H);
                break;
            case 0:
                default:
                _x = (table_outline_dr.TableOutline.X - _w);
                _y = (table_outline_dr.TableOutline.Y - _h);
                break;
            }
            overlay.CheckPoint(_ft.TransformPointX(_x, _y), _ft.TransformPointY(_x, _y));
            overlay.CheckPoint(_ft.TransformPointX(_x + _w, _y), _ft.TransformPointY(_x + _w, _y));
            overlay.CheckPoint(_ft.TransformPointX(_x + _w, _y + _h), _ft.TransformPointY(_x + _w, _y + _h));
            overlay.CheckPoint(_ft.TransformPointX(_x, _y + _h), _ft.TransformPointY(_x, _y + _h));
            overlay.m_oContext.drawImage(table_outline_dr.image, _x, _y, _w, _h);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    };
}
function CDrawingDocument(drawingObjects) {
    this.drawingObjects = drawingObjects;
    this.IsLockObjectsEnable = false;
    this.cursorMarkerFormat = "";
    if (bIsIE) {
        this.cursorMarkerFormat = "url(../../../sdk/Common/Images/marker_format.cur), pointer";
    } else {
        if (window.opera) {
            this.cursorMarkerFormat = "pointer";
        } else {
            this.cursorMarkerFormat = "url('data:image/png;base64,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        mWhBvQBxpekAAAAASUVORK5CYII=') 14 8, pointer";
        }
    }
    this.m_oWordControl = null;
    this.m_oLogicDocument = null;
    this.m_oDocumentRenderer = null;
    this.m_arrPages = [];
    this.m_lPagesCount = 0;
    this.m_lDrawingFirst = -1;
    this.m_lDrawingEnd = -1;
    this.m_lCurrentPage = -1;
    this.m_oCacheManager = new CCacheManager();
    this.m_lCountCalculatePages = 0;
    this.m_lTimerTargetId = -1;
    this.m_dTargetX = -1;
    this.m_dTargetY = -1;
    this.m_lTargetPage = -1;
    this.m_dTargetSize = 1;
    this.NeedScrollToTarget = true;
    this.NeedScrollToTargetFlag = false;
    this.TargetHtmlElement = null;
    this.m_bIsBreakRecalculate = false;
    this.m_bIsUpdateDocSize = false;
    this.m_bIsSelection = false;
    this.m_bIsSearching = false;
    this.m_lCountRect = 0;
    this.CurrentSearchNavi = null;
    this.SearchTransform = null;
    this.m_lTimerUpdateTargetID = -1;
    this.m_tempX = 0;
    this.m_tempY = 0;
    this.m_tempPageIndex = 0;
    var oThis = this;
    this.m_sLockedCursorType = "";
    this.TableOutlineDr = new CTableOutlineDr();
    this.m_lCurrentRendererPage = -1;
    this.m_oDocRenderer = null;
    this.m_bOldShowMarks = false;
    this.UpdateTargetFromPaint = false;
    this.UpdateTargetCheck = false;
    this.NeedTarget = true;
    this.TextMatrix = null;
    this.TargetShowFlag = false;
    this.TargetShowNeedFlag = false;
    this.CanvasHit = document.createElement("canvas");
    this.CanvasHit.width = 10;
    this.CanvasHit.height = 10;
    this.CanvasHitContext = this.CanvasHit.getContext("2d");
    this.TargetCursorColor = {
        R: 0,
        G: 0,
        B: 0
    };
    this.GuiControlColorsMap = null;
    this.IsSendStandartColors = false;
    this.GuiCanvasFillTextureParentId = "";
    this.GuiCanvasFillTexture = null;
    this.GuiCanvasFillTextureCtx = null;
    this.LastDrawingUrl = "";
    this.GuiCanvasTextProps = null;
    this.GuiCanvasTextPropsId = "gui_textprops_canvas_id";
    this.GuiLastTextProps = null;
    this.TableStylesLastLook = null;
    this.LastParagraphMargins = null;
    this.min_PageAddSelection = 100000;
    this.max_PageAddSelection = -1;
    this.IsShowSelectAttack = false;
    this.AutoShapesTrack = null;
    this.AutoShapesTrackLockPageNum = -1;
    this.Overlay = null;
    this.IsTextMatrixUse = false;
    this._search_HdrFtr_All = [];
    this._search_HdrFtr_All_no_First = [];
    this._search_HdrFtr_First = [];
    this._search_HdrFtr_Even = [];
    this._search_HdrFtr_Odd = [];
    this._search_HdrFtr_Odd_no_First = [];
    this.Start_CollaborationEditing = function () {
        this.IsLockObjectsEnable = true;
        this.m_oWordControl.OnRePaintAttack();
    };
    this.SetCursorType = function (sType, Data) {
        if ("" == this.m_sLockedCursorType) {
            if (this.m_oWordControl.m_oApi.isPaintFormat && "default" == sType) {
                this.m_oWordControl.m_oMainContent.HtmlElement.style.cursor = kCurFormatPainterWord;
            } else {
                if (this.m_oWordControl.m_oApi.isMarkerFormat && "default" == sType) {
                    this.m_oWordControl.m_oMainContent.HtmlElement.style.cursor = this.cursorMarkerFormat;
                } else {
                    this.m_oWordControl.m_oMainContent.HtmlElement.style.cursor = sType;
                }
            }
        } else {
            this.m_oWordControl.m_oMainContent.HtmlElement.style.cursor = this.m_sLockedCursorType;
        }
        if ("undefined" === typeof(Data) || null === Data) {
            Data = new CMouseMoveData();
        }
        editor.sync_MouseMoveCallback(Data);
    };
    this.LockCursorType = function (sType) {
        this.m_sLockedCursorType = sType;
        this.m_oWordControl.m_oMainContent.HtmlElement.style.cursor = this.m_sLockedCursorType;
    };
    this.LockCursorTypeCur = function () {
        this.m_sLockedCursorType = this.m_oWordControl.m_oMainContent.HtmlElement.style.cursor;
    };
    this.UnlockCursorType = function () {
        this.m_sLockedCursorType = "";
    };
    this.OnStartRecalculate = function (pageCount) {
        this.m_lCountCalculatePages = pageCount;
    };
    this.OnRepaintPage = function (index) {
        var page = this.m_arrPages[index];
        if (!page) {
            return;
        }
        if (null != page.drawingPage.cachedImage) {
            this.m_oCacheManager.UnLock(page.drawingPage.cachedImage);
            page.drawingPage.cachedImage = null;
        }
        if (index >= this.m_lDrawingFirst && index <= this.m_lDrawingEnd) {
            this.m_oWordControl.OnScroll();
        }
    };
    this.OnRecalculatePage = function (index, pageObject) {
        editor.asc_fireCallback("asc_onDocumentChanged");
        if (true === this.m_bIsSearching) {
            this.SearchClear();
            this.m_oWordControl.OnUpdateOverlay();
        }
        if (true === this.m_oWordControl.m_oApi.isMarkerFormat) {
            this.m_oWordControl.m_oApi.sync_MarkerFormatCallback(false);
        }
        if (this.m_bIsBreakRecalculate) {
            this.m_bIsBreakRecalculate = false;
            this.m_lCountCalculatePages = index;
        }
        this.m_lCountCalculatePages = index + 1;
        if (undefined === this.m_arrPages[index]) {
            this.m_arrPages[index] = new CPage();
        }
        var page = this.m_arrPages[index];
        page.width_mm = pageObject.Width;
        page.height_mm = pageObject.Height;
        page.margin_left = pageObject.Margins.Left;
        page.margin_top = pageObject.Margins.Top;
        page.margin_right = pageObject.Margins.Right;
        page.margin_bottom = pageObject.Margins.Bottom;
        page.index = index;
        if (null != page.drawingPage.cachedImage) {
            this.m_oCacheManager.UnLock(page.drawingPage.cachedImage);
            page.drawingPage.cachedImage = null;
        }
        if (index >= this.m_lDrawingFirst && index <= this.m_lDrawingEnd) {
            this.m_oWordControl.OnScroll();
        }
        if (this.m_lCountCalculatePages > (this.m_lPagesCount + 50) || (0 == this.m_lPagesCount && 0 != this.m_lCountCalculatePages)) {
            this.OnEndRecalculate(false);
        }
    };
    this.OnEndRecalculate = function (isFull, isBreak) {
        if (undefined != isBreak) {
            this.m_lCountCalculatePages = this.m_lPagesCount;
        }
        for (var index = this.m_lCountCalculatePages; index < this.m_lPagesCount; index++) {
            var page = this.m_arrPages[index];
            if (null != page.drawingPage.cachedImage) {
                this.m_oCacheManager.UnLock(page.drawingPage.cachedImage);
                page.drawingPage.cachedImage = null;
            }
        }
        this.m_bIsBreakRecalculate = (isFull === true) ? false : true;
        if (((this.m_lPagesCount != this.m_lCountCalculatePages) && isFull) || this.m_bIsUpdateDocSize) {
            if (this.m_lPagesCount > this.m_lCountCalculatePages) {
                this.m_arrPages.splice(this.m_lCountCalculatePages, this.m_lPagesCount - this.m_lCountCalculatePages);
            }
            this.m_lPagesCount = this.m_lCountCalculatePages;
            this.m_oWordControl.CalculateDocumentSize();
            this.m_bIsOpeningDocument = false;
            this.m_bIsUpdateDocSize = false;
        } else {
            if ((this.m_lPagesCount + 50) < this.m_lCountCalculatePages) {
                this.m_lPagesCount = this.m_lCountCalculatePages;
                this.m_oWordControl.CalculateDocumentSize();
            } else {
                if (0 == this.m_lPagesCount && 0 != this.m_lCountCalculatePages) {
                    this.m_lPagesCount = this.m_lCountCalculatePages;
                    this.m_oWordControl.CalculateDocumentSize();
                }
            }
        }
        if (true === isBreak || isFull) {
            this.m_lCurrentPage = this.m_oWordControl.m_oLogicDocument.Get_CurPage();
        }
        if (-1 != this.m_lCurrentPage) {
            this.m_oWordControl.m_oApi.sync_currentPageCallback(this.m_lCurrentPage);
            this.m_oWordControl.m_oApi.sync_countPagesCallback(this.m_lPagesCount);
            var bIsSendCurPage = true;
            if (this.m_oWordControl.m_oLogicDocument && this.m_oWordControl.m_oLogicDocument.DrawingObjects) {
                var param = this.m_oWordControl.m_oLogicDocument.DrawingObjects.isNeedUpdateRulers();
                if (true === param) {
                    bIsSendCurPage = false;
                    this.m_oWordControl.SetCurrentPage(false);
                }
            }
            if (bIsSendCurPage) {
                this.m_oWordControl.SetCurrentPage();
            }
        }
        if (isFull) {
            this.m_oWordControl.OnScroll();
        }
    };
    this.ChangePageAttack = function (pageIndex) {
        if (pageIndex < this.m_lDrawingFirst || pageIndex > this.m_lDrawingEnd) {
            return;
        }
        this.StopRenderingPage(pageIndex);
        this.m_oWordControl.OnScroll();
    };
    this.StartRenderingPage = function (pageIndex) {
        if (true === this.IsFreezePage(pageIndex)) {
            return;
        }
        var page = this.m_arrPages[pageIndex];
        var w = parseInt(this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix * page.width_mm / 100);
        var h = parseInt(this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix * page.height_mm / 100);
        if (this.m_oWordControl.bIsRetinaSupport) {
            w *= 2;
            h *= 2;
        }
        if (g_bIsMobile) {
            var _mobile_max = 2000;
            if (w > _mobile_max || h > _mobile_max) {
                if (w > h) {
                    h = parseInt(h * _mobile_max / w);
                    w = _mobile_max;
                } else {
                    w = parseInt(w * _mobile_max / h);
                    h = _mobile_max;
                }
            }
        }
        page.drawingPage.cachedImage = this.m_oCacheManager.Lock(w, h);
        var g = new CGraphics();
        g.init(page.drawingPage.cachedImage.image.ctx, w, h, page.width_mm, page.height_mm);
        g.m_oFontManager = g_fontManager;
        g.transform(1, 0, 0, 1, 0, 0);
        if (null == this.m_oDocumentRenderer) {
            this.m_oLogicDocument.DrawPage(pageIndex, g);
        } else {
            this.m_oDocumentRenderer.drawPage(pageIndex, g);
        }
    };
    this.IsFreezePage = function (pageIndex) {
        if (pageIndex >= 0 && (pageIndex < Math.min(this.m_lCountCalculatePages, this.m_lPagesCount))) {
            return false;
        }
        return true;
    };
    this.RenderDocument = function (Renderer) {
        for (var i = 0; i < this.m_lPagesCount; i++) {
            var page = this.m_arrPages[i];
            Renderer.BeginPage(page.width_mm, page.height_mm);
            this.m_oLogicDocument.DrawPage(i, Renderer);
            Renderer.EndPage();
        }
    };
    this.ToRenderer = function () {
        var Renderer = new CDocumentRenderer();
        Renderer.VectorMemoryForPrint = new CMemory();
        var old_marks = this.m_oWordControl.m_oApi.ShowParaMarks;
        this.m_oWordControl.m_oApi.ShowParaMarks = false;
        this.RenderDocument(Renderer);
        this.m_oWordControl.m_oApi.ShowParaMarks = old_marks;
        var ret = Renderer.Memory.GetBase64Memory();
        return ret;
    };
    this.ToRenderer2 = function () {
        var Renderer = new CDocumentRenderer();
        var old_marks = this.m_oWordControl.m_oApi.ShowParaMarks;
        this.m_oWordControl.m_oApi.ShowParaMarks = false;
        var ret = "";
        for (var i = 0; i < this.m_lPagesCount; i++) {
            var page = this.m_arrPages[i];
            Renderer.BeginPage(page.width_mm, page.height_mm);
            this.m_oLogicDocument.DrawPage(i, Renderer);
            Renderer.EndPage();
            ret += Renderer.Memory.GetBase64Memory();
            Renderer.Memory.Seek(0);
        }
        this.m_oWordControl.m_oApi.ShowParaMarks = old_marks;
        return ret;
    };
    this.isComleteRenderer = function () {
        var pagescount = Math.min(this.m_lPagesCount, this.m_lCountCalculatePages);
        if (this.m_lCurrentRendererPage >= pagescount) {
            this.m_lCurrentRendererPage = -1;
            this.m_oDocRenderer = null;
            this.m_oWordControl.m_oApi.ShowParaMarks = this.m_bOldShowMarks;
            return true;
        }
        return false;
    };
    this.isComleteRenderer2 = function () {
        var pagescount = Math.min(this.m_lPagesCount, this.m_lCountCalculatePages);
        var start = Math.max(this.m_lCurrentRendererPage, 0);
        var end = Math.min(start + 50, pagescount - 1);
        if ((end + 1) >= pagescount) {
            return true;
        }
        return false;
    };
    this.ToRendererPart = function () {
        var pagescount = Math.min(this.m_lPagesCount, this.m_lCountCalculatePages);
        if (-1 == this.m_lCurrentRendererPage) {
            this.m_oDocRenderer = new CDocumentRenderer();
            this.m_oDocRenderer.VectorMemoryForPrint = new CMemory();
            this.m_lCurrentRendererPage = 0;
            this.m_bOldShowMarks = this.m_oWordControl.m_oApi.ShowParaMarks;
            this.m_oWordControl.m_oApi.ShowParaMarks = false;
        }
        var start = this.m_lCurrentRendererPage;
        var end = Math.min(this.m_lCurrentRendererPage + 50, pagescount - 1);
        var renderer = this.m_oDocRenderer;
        renderer.Memory.Seek(0);
        renderer.VectorMemoryForPrint.ClearNoAttack();
        for (var i = start; i <= end; i++) {
            var page = this.m_arrPages[i];
            renderer.BeginPage(page.width_mm, page.height_mm);
            this.m_oLogicDocument.DrawPage(i, renderer);
            renderer.EndPage();
            editor.async_SaveToPdf_Progress(parseInt((i + 1) * 100 / pagescount));
        }
        this.m_lCurrentRendererPage = end + 1;
        if (this.m_lCurrentRendererPage >= pagescount) {
            this.m_lCurrentRendererPage = -1;
            this.m_oDocRenderer = null;
            this.m_oWordControl.m_oApi.ShowParaMarks = this.m_bOldShowMarks;
        }
        return renderer.Memory.GetBase64Memory();
    };
    this.StopRenderingPage = function (pageIndex) {
        if (null != this.m_oDocumentRenderer) {
            this.m_oDocumentRenderer.stopRenderingPage(pageIndex);
        }
        if (null != this.m_arrPages[pageIndex].drawingPage.cachedImage) {
            this.m_oCacheManager.UnLock(this.m_arrPages[pageIndex].drawingPage.cachedImage);
            this.m_arrPages[pageIndex].drawingPage.cachedImage = null;
        }
    };
    this.ClearCachePages = function () {
        for (var i = 0; i < this.m_lPagesCount; i++) {
            this.StopRenderingPage(i);
        }
    };
    this.CheckRasterImageOnScreen = function (src) {
        if (null == this.m_oWordControl.m_oLogicDocument) {
            return;
        }
        if (this.m_lDrawingFirst == -1 || this.m_lDrawingEnd == -1) {
            return;
        }
        var bIsRaster = false;
        var _checker = this.m_oWordControl.m_oLogicDocument.DrawingObjects;
        for (var i = this.m_lDrawingFirst; i <= this.m_lDrawingEnd; i++) {
            var _imgs = _checker.getAllRasterImagesOnPage(i);
            var _len = _imgs.length;
            for (var j = 0; j < _len; j++) {
                if (getFullImageSrc(_imgs[j]) == src) {
                    this.StopRenderingPage(i);
                    bIsRaster = true;
                    break;
                }
            }
        }
        if (bIsRaster) {
            this.m_oWordControl.OnScroll();
        }
    };
    this.FirePaint = function () {
        this.m_oWordControl.OnScroll();
    };
    this.ConvertCoordsFromCursor = function (x, y, bIsRul) {
        var _x = x;
        var _y = y;
        var dKoef = (100 * g_dKoef_pix_to_mm / this.m_oWordControl.m_nZoomValue);
        if (undefined == bIsRul) {
            var _xOffset = this.m_oWordControl.X;
            var _yOffset = this.m_oWordControl.Y;
            _x = x - _xOffset;
            _y = y - _yOffset;
        }
        for (var i = this.m_lDrawingFirst; i <= this.m_lDrawingEnd; i++) {
            var rect = this.m_arrPages[i].drawingPage;
            if ((rect.left <= _x) && (_x <= rect.right) && (rect.top <= _y) && (_y <= rect.bottom)) {
                var x_mm = (_x - rect.left) * dKoef;
                var y_mm = (_y - rect.top) * dKoef;
                return {
                    X: x_mm,
                    Y: y_mm,
                    Page: rect.pageIndex,
                    DrawPage: i
                };
            }
        }
        return {
            X: 0,
            Y: 0,
            Page: -1,
            DrawPage: -1
        };
    };
    this.ConvertCoordsFromCursorPage = function (x, y, page, bIsRul) {
        var _x = x;
        var _y = y;
        var dKoef = (100 * g_dKoef_pix_to_mm / this.m_oWordControl.m_nZoomValue);
        if (undefined == bIsRul) {
            var _xOffset = this.m_oWordControl.X;
            var _yOffset = this.m_oWordControl.Y;
            _x = x - _xOffset;
            _y = y - _yOffset;
        }
        if (page < 0 || page >= this.m_lPagesCount) {
            return {
                X: 0,
                Y: 0,
                Page: -1,
                DrawPage: -1
            };
        }
        var rect = this.m_arrPages[page].drawingPage;
        var x_mm = (_x - rect.left) * dKoef;
        var y_mm = (_y - rect.top) * dKoef;
        return {
            X: x_mm,
            Y: y_mm,
            Page: rect.pageIndex,
            DrawPage: i
        };
    };
    this.ConvertCoordsToAnotherPage = function (x, y, pageCoord, pageNeed) {
        if (pageCoord < 0 || pageCoord >= this.m_lPagesCount || pageNeed < 0 || pageNeed >= this.m_lPagesCount) {
            return {
                X: 0,
                Y: 0,
                Error: true
            };
        }
        var dKoef1 = this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100;
        var dKoef2 = 100 * g_dKoef_pix_to_mm / this.m_oWordControl.m_nZoomValue;
        var page1 = this.m_arrPages[pageCoord].drawingPage;
        var page2 = this.m_arrPages[pageNeed].drawingPage;
        var xCursor = page1.left + x * dKoef1;
        var yCursor = page1.top + y * dKoef1;
        var _x = (xCursor - page2.left) * dKoef2;
        var _y = (yCursor - page2.top) * dKoef2;
        return {
            X: _x,
            Y: _y,
            Error: false
        };
    };
    this.ConvertCoordsFromCursor2 = function (x, y, bIsRul, bIsNoNormalize, _zoomVal) {
        var _x = x;
        var _y = y;
        var dKoef = (100 * g_dKoef_pix_to_mm / this.m_oWordControl.m_nZoomValue);
        if (undefined !== _zoomVal) {
            dKoef = (100 * g_dKoef_pix_to_mm / _zoomVal);
        }
        if (undefined == bIsRul) {
            var _xOffset = this.m_oWordControl.X;
            var _yOffset = this.m_oWordControl.Y;
            if (true == this.m_oWordControl.m_bIsRuler) {
                _xOffset += (5 * g_dKoef_mm_to_pix);
                _yOffset += (7 * g_dKoef_mm_to_pix);
            }
            _x = x - _xOffset;
            _y = y - _yOffset;
        }
        if (-1 == this.m_lDrawingFirst || -1 == this.m_lDrawingEnd) {
            return {
                X: 0,
                Y: 0,
                Page: -1,
                DrawPage: -1
            };
        }
        for (var i = this.m_lDrawingFirst; i <= this.m_lDrawingEnd; i++) {
            var rect = this.m_arrPages[i].drawingPage;
            if ((rect.left <= _x) && (_x <= rect.right) && (rect.top <= _y) && (_y <= rect.bottom)) {
                var x_mm = (_x - rect.left) * dKoef;
                var y_mm = (_y - rect.top) * dKoef;
                if (x_mm > (this.m_arrPages[i].width_mm + 10)) {
                    x_mm = this.m_arrPages[i].width_mm + 10;
                }
                if (x_mm < -10) {
                    x_mm = -10;
                }
                return {
                    X: x_mm,
                    Y: y_mm,
                    Page: rect.pageIndex,
                    DrawPage: i
                };
            }
        }
        var _start = Math.max(this.m_lDrawingFirst - 1, 0);
        var _end = Math.min(this.m_lDrawingEnd + 1, this.m_lPagesCount - 1);
        for (var i = _start; i <= _end; i++) {
            var rect = this.m_arrPages[i].drawingPage;
            var bIsCurrent = false;
            if (i == this.m_lDrawingFirst && rect.top > _y) {
                bIsCurrent = true;
            } else {
                if ((rect.top <= _y) && (_y <= rect.bottom)) {
                    bIsCurrent = true;
                } else {
                    if (i != this.m_lPagesCount - 1) {
                        if (_y > rect.bottom && _y < this.m_arrPages[i + 1].drawingPage.top) {
                            bIsCurrent = true;
                        }
                    } else {
                        if (_y < rect.top) {
                            bIsCurrent = true;
                        } else {
                            if (i == this.m_lDrawingEnd) {
                                if (_y > rect.bottom) {
                                    bIsCurrent = true;
                                }
                            }
                        }
                    }
                }
            }
            if (bIsCurrent) {
                var x_mm = (_x - rect.left) * dKoef;
                var y_mm = (_y - rect.top) * dKoef;
                if (true === bIsNoNormalize) {
                    if (x_mm > (this.m_arrPages[i].width_mm + 10)) {
                        x_mm = this.m_arrPages[i].width_mm + 10;
                    }
                    if (x_mm < -10) {
                        x_mm = -10;
                    }
                }
                return {
                    X: x_mm,
                    Y: y_mm,
                    Page: rect.pageIndex,
                    DrawPage: i
                };
            }
        }
        return {
            X: 0,
            Y: 0,
            Page: -1,
            DrawPage: -1
        };
    };
    this.ConvetToPageCoords = function (x, y, pageIndex) {
        if (pageIndex < 0 || pageIndex >= this.m_lPagesCount) {
            return {
                X: 0,
                Y: 0,
                Page: pageIndex,
                Error: true
            };
        }
        var dKoef = (100 * g_dKoef_pix_to_mm / this.m_oWordControl.m_nZoomValue);
        var rect = this.m_arrPages[pageIndex].drawingPage;
        var _x = (x - rect.left) * dKoef;
        var _y = (y - rect.top) * dKoef;
        return {
            X: _x,
            Y: _y,
            Page: pageIndex,
            Error: false
        };
    };
    this.IsCursorInTableCur = function (x, y, page) {
        var _table = this.TableOutlineDr.TableOutline;
        if (_table == null) {
            return false;
        }
        if (page != _table.PageNum) {
            return false;
        }
        var _dist = this.TableOutlineDr.image.width * g_dKoef_pix_to_mm;
        _dist *= (100 / this.m_oWordControl.m_nZoomValue);
        var _x = _table.X;
        var _y = _table.Y;
        var _r = _x + _table.W;
        var _b = _y + _table.H;
        if ((x > (_x - _dist)) && (x < _r) && (y > (_y - _dist)) && (y < _b)) {
            if ((x < _x) || (y < _y)) {
                this.TableOutlineDr.Counter = 0;
                this.TableOutlineDr.bIsNoTable = false;
                return true;
            }
        }
        return false;
    };
    this.ConvertCoordsToCursorWR = function (x, y, pageIndex, transform) {
        var dKoef = (this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100);
        var _x = 0;
        var _y = 0;
        if (true == this.m_oWordControl.m_bIsRuler) {
            _x = 5 * g_dKoef_mm_to_pix;
            _y = 7 * g_dKoef_mm_to_pix;
        }
        if (pageIndex < 0 || pageIndex >= this.m_lPagesCount) {
            return {
                X: 0,
                Y: 0,
                Error: true
            };
        }
        var __x = x;
        var __y = y;
        if (transform) {
            __x = transform.TransformPointX(x, y);
            __y = transform.TransformPointY(x, y);
        }
        var x_pix = parseInt(this.m_arrPages[pageIndex].drawingPage.left + __x * dKoef + _x);
        var y_pix = parseInt(this.m_arrPages[pageIndex].drawingPage.top + __y * dKoef + _y);
        return {
            X: x_pix,
            Y: y_pix,
            Error: false
        };
    };
    this.ConvertCoordsToCursor = function (x, y, pageIndex, bIsRul) {
        var dKoef = (this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100);
        var _x = 0;
        var _y = 0;
        if (true == this.m_oWordControl.m_bIsRuler) {
            if (undefined == bIsRul) {}
        }
        if (pageIndex < 0 || pageIndex >= this.m_lPagesCount) {
            return {
                X: 0,
                Y: 0,
                Error: true
            };
        }
        var x_pix = parseInt(this.m_arrPages[pageIndex].drawingPage.left + x * dKoef + _x);
        var y_pix = parseInt(this.m_arrPages[pageIndex].drawingPage.top + y * dKoef + _y);
        return {
            X: x_pix,
            Y: y_pix,
            Error: false
        };
        for (var i = this.m_lDrawingFirst; i <= this.m_lDrawingEnd; i++) {
            var rect = this.m_arrPages[i].drawingPage;
            if (this.m_arrPages[i].pageIndex == pageIndex) {
                var x_pix = parseInt(rect.left + x * dKoef + _x);
                var y_pix = parseInt(rect.top + y * dKoef + _y);
                return {
                    X: x_pix,
                    Y: y_pix,
                    Error: false
                };
            }
        }
        return {
            X: 0,
            Y: 0,
            Error: true
        };
    };
    this.ConvertCoordsToCursor2 = function (x, y, pageIndex, bIsRul) {
        var dKoef = (this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100);
        var _x = 0;
        var _y = 0;
        if (true == this.m_oWordControl.m_bIsRuler) {
            if (undefined == bIsRul) {}
        }
        if (pageIndex < 0 || pageIndex >= this.m_lPagesCount) {
            return {
                X: 0,
                Y: 0,
                Error: true
            };
        }
        var x_pix = parseInt(this.m_arrPages[pageIndex].drawingPage.left + x * dKoef + _x - 0.5);
        var y_pix = parseInt(this.m_arrPages[pageIndex].drawingPage.top + y * dKoef + _y - 0.5);
        return {
            X: x_pix,
            Y: y_pix,
            Error: false
        };
    };
    this.ConvertCoordsToCursor3 = function (x, y, pageIndex) {
        if (pageIndex < 0 || pageIndex >= this.m_lPagesCount) {
            return {
                X: 0,
                Y: 0,
                Error: true
            };
        }
        var dKoef = (this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100);
        var _x = this.m_oWordControl.X;
        var _y = this.m_oWordControl.Y;
        var x_pix = parseInt(this.m_arrPages[pageIndex].drawingPage.left + x * dKoef + _x + 0.5);
        var y_pix = parseInt(this.m_arrPages[pageIndex].drawingPage.top + y * dKoef + _y + 0.5);
        return {
            X: x_pix,
            Y: y_pix,
            Error: false
        };
    };
    this.InitViewer = function () {};
    this.TargetStart = function () {
        if (this.m_lTimerTargetId != -1) {
            clearInterval(this.m_lTimerTargetId);
        }
        this.m_lTimerTargetId = setInterval(oThis.DrawTarget, 500);
    };
    this.TargetEnd = function () {
        this.TargetShowFlag = false;
        this.TargetShowNeedFlag = false;
        if (this.m_lTimerTargetId != -1) {
            clearInterval(this.m_lTimerTargetId);
            this.m_lTimerTargetId = -1;
        }
        this.TargetHtmlElement.style.display = "none";
    };
    this.UpdateTargetNoAttack = function () {
        if (null == this.m_oWordControl) {
            return;
        }
        this.CheckTargetDraw(this.m_dTargetX, this.m_dTargetY);
    };
    this.GetTargetStyle = function () {
        return "rgb(" + this.TargetCursorColor.R + "," + this.TargetCursorColor.G + "," + this.TargetCursorColor.B + ")";
    };
    this.SetTargetColor = function (r, g, b) {
        this.TargetCursorColor.R = r;
        this.TargetCursorColor.G = g;
        this.TargetCursorColor.B = b;
    };
    this.CheckTargetDraw = function (x, y) {
        var _oldW = this.TargetHtmlElement.width;
        var _oldH = this.TargetHtmlElement.height;
        var dKoef = this.drawingObjects.convertMetric(1, 3, 0);
        var _newW = 2;
        var _newH = this.m_dTargetSize * dKoef;
        var _offX = 0;
        var _offY = 0;
        if (this.AutoShapesTrack && this.AutoShapesTrack.Graphics && this.AutoShapesTrack.Graphics.m_oCoordTransform) {
            _offX = this.AutoShapesTrack.Graphics.m_oCoordTransform.tx;
            _offY = this.AutoShapesTrack.Graphics.m_oCoordTransform.ty;
        }
        var _factor = AscBrowser.isRetina ? 1 : 0;
        if (null != this.TextMatrix && !global_MatrixTransformer.IsIdentity2(this.TextMatrix)) {
            var _x1 = this.TextMatrix.TransformPointX(x, y);
            var _y1 = this.TextMatrix.TransformPointY(x, y);
            var _x2 = this.TextMatrix.TransformPointX(x, y + this.m_dTargetSize);
            var _y2 = this.TextMatrix.TransformPointY(x, y + this.m_dTargetSize);
            var pos1 = {
                X: _offX + dKoef * _x1,
                Y: _offY + dKoef * _y1
            };
            var pos2 = {
                X: _offX + dKoef * _x2,
                Y: _offY + dKoef * _y2
            };
            _newW = (((Math.abs(pos1.X - pos2.X) >> 0) + 1) >> 1) << 1;
            _newH = (((Math.abs(pos1.Y - pos2.Y) >> 0) + 1) >> 1) << 1;
            if (2 > _newW) {
                _newW = 2;
            }
            if (2 > _newH) {
                _newH = 2;
            }
            if (_oldW == _newW && _oldH == _newH) {
                this.TargetHtmlElement.width = _newW;
            } else {
                this.TargetHtmlElement.style.width = (_newW >> _factor) + "px";
                this.TargetHtmlElement.style.height = (_newH >> _factor) + "px";
                this.TargetHtmlElement.width = _newW;
                this.TargetHtmlElement.height = _newH;
            }
            var ctx = this.TargetHtmlElement.getContext("2d");
            if (_newW == 2 || _newH == 2) {
                ctx.fillStyle = this.GetTargetStyle();
                ctx.fillRect(0, 0, _newW, _newH);
            } else {
                ctx.beginPath();
                ctx.strokeStyle = this.GetTargetStyle();
                ctx.lineWidth = 2;
                if (((pos1.X - pos2.X) * (pos1.Y - pos2.Y)) >= 0) {
                    ctx.moveTo(0, 0);
                    ctx.lineTo(_newW, _newH);
                } else {
                    ctx.moveTo(0, _newH);
                    ctx.lineTo(_newW, 0);
                }
                ctx.stroke();
            }
            this.TargetHtmlElement.style.left = (Math.min(pos1.X, pos2.X) >> _factor) + "px";
            this.TargetHtmlElement.style.top = (Math.min(pos1.Y, pos2.Y) >> _factor) + "px";
        } else {
            if (_oldW == _newW && _oldH == _newH) {
                this.TargetHtmlElement.width = _newW;
            } else {
                this.TargetHtmlElement.style.width = (_newW >> _factor) + "px";
                this.TargetHtmlElement.style.height = (_newH >> _factor) + "px";
                this.TargetHtmlElement.width = _newW;
                this.TargetHtmlElement.height = _newH;
            }
            var ctx = this.TargetHtmlElement.getContext("2d");
            ctx.fillStyle = this.GetTargetStyle();
            ctx.fillRect(0, 0, _newW, _newH);
            if (null != this.TextMatrix) {
                x += this.TextMatrix.tx;
                y += this.TextMatrix.ty;
            }
            var pos = {
                X: _offX + dKoef * x,
                Y: _offY + dKoef * y
            };
            this.TargetHtmlElement.style.left = (pos.X >> _factor) + "px";
            this.TargetHtmlElement.style.top = (pos.Y >> _factor) + "px";
        }
    };
    this.UpdateTargetTransform = function (matrix) {
        this.TextMatrix = matrix;
    };
    this.UpdateTarget = function (x, y, pageIndex) {
        if (-1 != this.m_lTimerUpdateTargetID) {
            clearTimeout(this.m_lTimerUpdateTargetID);
            this.m_lTimerUpdateTargetID = -1;
        }
        this.m_dTargetX = x;
        this.m_dTargetY = y;
        this.m_lTargetPage = pageIndex;
        this.CheckTargetDraw(x, y);
    };
    this.UpdateTarget2 = function (x, y, pageIndex) {
        if (pageIndex >= this.m_arrPages.length) {
            return;
        }
        this.m_oWordControl.m_oLogicDocument.Set_TargetPos(x, y, pageIndex);
        var bIsPageChanged = false;
        if (this.m_lCurrentPage != pageIndex) {
            this.m_lCurrentPage = pageIndex;
            this.m_oWordControl.SetCurrentPage2();
            this.m_oWordControl.OnScroll();
            bIsPageChanged = true;
        }
        this.m_dTargetX = x;
        this.m_dTargetY = y;
        this.m_lTargetPage = pageIndex;
        var pos = this.ConvertCoordsToCursor(x, y, this.m_lCurrentPage);
        if (true == pos.Error && (false == bIsPageChanged)) {
            return;
        }
        var boxX = 0;
        var boxY = 0;
        var boxR = this.m_oWordControl.m_oEditor.HtmlElement.width;
        var boxB = this.m_oWordControl.m_oEditor.HtmlElement.height;
        var nValueScrollHor = 0;
        if (pos.X < boxX) {
            nValueScrollHor = this.m_oWordControl.GetHorizontalScrollTo(x - 5, pageIndex);
        }
        if (pos.X > boxR) {
            var _mem = x + 5 - g_dKoef_pix_to_mm * this.m_oWordControl.m_oEditor.HtmlElement.width * 100 / this.m_oWordControl.m_nZoomValue;
            nValueScrollHor = this.m_oWordControl.GetHorizontalScrollTo(_mem, pageIndex);
        }
        var nValueScrollVer = 0;
        if (pos.Y < boxY) {
            nValueScrollVer = this.m_oWordControl.GetVerticalScrollTo(y - 5, pageIndex);
        }
        if (pos.Y > boxB) {
            var _mem = y + this.m_dTargetSize + 5 - g_dKoef_pix_to_mm * this.m_oWordControl.m_oEditor.HtmlElement.height * 100 / this.m_oWordControl.m_nZoomValue;
            nValueScrollVer = this.m_oWordControl.GetVerticalScrollTo(_mem, pageIndex);
        }
        var isNeedScroll = false;
        if (0 != nValueScrollHor) {
            isNeedScroll = true;
            var temp = nValueScrollHor * this.m_oWordControl.m_dScrollX_max / (this.m_oWordControl.m_dDocumentWidth - this.m_oWordControl.m_oEditor.HtmlElement.width);
            this.m_oWordControl.m_oScrollHorApi.scrollToX(parseInt(temp), false);
        }
        if (0 != nValueScrollVer) {
            isNeedScroll = true;
            var temp = nValueScrollVer * this.m_oWordControl.m_dScrollY_max / (this.m_oWordControl.m_dDocumentHeight - this.m_oWordControl.m_oEditor.HtmlElement.height);
            this.m_oWordControl.m_oScrollVerApi.scrollToY(parseInt(temp), false);
        }
        if (true == isNeedScroll) {
            this.m_oWordControl.OnScroll();
            return;
        }
    };
    this.UpdateTargetTimer = function () {
        var x = oThis.m_tempX;
        var y = oThis.m_tempY;
        var pageIndex = oThis.m_tempPageIndex;
        oThis.m_lTimerUpdateTargetID = -1;
        if (pageIndex >= oThis.m_arrPages.length) {
            return;
        }
        var oWordControl = oThis.m_oWordControl;
        var bIsPageChanged = false;
        if (oThis.m_lCurrentPage != pageIndex) {
            oThis.m_lCurrentPage = pageIndex;
            oWordControl.SetCurrentPage2();
            oWordControl.OnScroll();
            bIsPageChanged = true;
        }
        oThis.m_dTargetX = x;
        oThis.m_dTargetY = y;
        oThis.m_lTargetPage = pageIndex;
        var targetSize = Number(oThis.m_dTargetSize * oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100);
        var pos = oThis.ConvertCoordsToCursor2(x, y, oThis.m_lCurrentPage);
        if (true === pos.Error && (false === bIsPageChanged)) {
            return;
        }
        var boxX = 0;
        var boxY = 0;
        var boxR = oWordControl.m_oEditor.HtmlElement.width - 2;
        var boxB = oWordControl.m_oEditor.HtmlElement.height - targetSize;
        var nValueScrollHor = 0;
        if (pos.X < boxX) {
            nValueScrollHor = boxX - pos.X;
        }
        if (pos.X > boxR) {
            nValueScrollHor = boxR - pos.X;
        }
        var nValueScrollVer = 0;
        if (pos.Y < boxY) {
            nValueScrollVer = boxY - pos.Y;
        }
        if (pos.Y > boxB) {
            nValueScrollVer = boxB - pos.Y;
        }
        var isNeedScroll = false;
        if (0 != nValueScrollHor) {
            isNeedScroll = true;
            oWordControl.m_bIsUpdateTargetNoAttack = true;
            oWordControl.m_oScrollHorApi.scrollByX(-nValueScrollHor, false);
        }
        if (0 != nValueScrollVer) {
            isNeedScroll = true;
            oWordControl.m_bIsUpdateTargetNoAttack = true;
            oWordControl.m_oScrollVerApi.scrollByY(-nValueScrollVer, false);
        }
        if (true === isNeedScroll) {
            oWordControl.m_bIsUpdateTargetNoAttack = true;
            oWordControl.OnScroll();
            return;
        }
        oThis.TargetHtmlElement.style.left = pos.X + "px";
        oThis.TargetHtmlElement.style.top = pos.Y + "px";
        this.m_oWordControl.CheckTextBoxInputPos();
        if (this.m_bIsSearching && null != this.CurrentSearchNavi) {
            this.CurrentSearchNavi = null;
            this.drawingObjects.OnUpdateOverlay();
        }
    };
    this.SetTargetSize = function (size) {
        this.m_dTargetSize = size;
    };
    this.DrawTarget = function () {
        if ("block" != oThis.TargetHtmlElement.style.display && oThis.NeedTarget) {
            oThis.TargetHtmlElement.style.display = "block";
        } else {
            oThis.TargetHtmlElement.style.display = "none";
        }
    };
    this.TargetShow = function () {
        this.TargetShowNeedFlag = true;
    };
    this.CheckTargetShow = function () {
        if (this.TargetShowFlag && this.TargetShowNeedFlag) {
            this.TargetHtmlElement.style.display = "block";
            this.TargetShowNeedFlag = false;
            return;
        }
        if (!this.TargetShowNeedFlag) {
            return;
        }
        this.TargetShowNeedFlag = false;
        if (-1 == this.m_lTimerTargetId) {
            this.TargetStart();
        }
        if (oThis.NeedTarget) {
            this.TargetHtmlElement.style.display = "block";
        }
        this.TargetShowFlag = true;
    };
    this.StartTrackImage = function (obj, x, y, w, h, type, pagenum) {};
    this.StartTrackTable = function (obj, transform) {
        if (this.m_oWordControl.MobileTouchManager) {
            if (!this.m_oWordControl.MobileTouchManager.TableStartTrack_Check) {
                return;
            }
        }
        this.TableOutlineDr.TableOutline = obj;
        this.TableOutlineDr.Counter = 0;
        this.TableOutlineDr.bIsNoTable = false;
        this.TableOutlineDr.CheckStartTrack(this.m_oWordControl, transform);
        if (this.m_oWordControl.MobileTouchManager) {
            this.m_oWordControl.OnUpdateOverlay();
        }
    };
    this.EndTrackTable = function (pointer, bIsAttack) {
        if (this.TableOutlineDr.TableOutline != null) {
            if (pointer == this.TableOutlineDr.TableOutline.Table || bIsAttack) {
                this.TableOutlineDr.TableOutline = null;
                this.TableOutlineDr.Counter = 0;
            }
        }
    };
    this.CheckTrackTable = function () {
        if (null == this.TableOutlineDr.TableOutline) {
            return;
        }
        if (this.TableOutlineDr.bIsNoTable && this.TableOutlineDr.bIsTracked === false) {
            this.TableOutlineDr.Counter++;
            if (this.TableOutlineDr.Counter > 100) {
                this.TableOutlineDr.TableOutline = null;
                this.m_oWordControl.OnUpdateOverlay();
            }
        }
    };
    this.DrawTableTrack = function (overlay) {
        if (null == this.TableOutlineDr.TableOutline) {
            return;
        }
        var _table = this.TableOutlineDr.TableOutline.Table;
        if (!_table.Is_Inline()) {
            if (null == this.TableOutlineDr.CurPos) {
                return;
            }
            var _page = this.m_arrPages[this.TableOutlineDr.CurPos.Page];
            var drPage = _page.drawingPage;
            var dKoefX = (drPage.right - drPage.left) / _page.width_mm;
            var dKoefY = (drPage.bottom - drPage.top) / _page.height_mm;
            if (!this.TableOutlineDr.TableMatrix || global_MatrixTransformer.IsIdentity(this.TableOutlineDr.TableMatrix)) {
                var _x = parseInt(drPage.left + dKoefX * (this.TableOutlineDr.CurPos.X + _table.Get_TableOffsetCorrection())) + 0.5;
                var _y = parseInt(drPage.top + dKoefY * this.TableOutlineDr.CurPos.Y) + 0.5;
                var _r = _x + parseInt(dKoefX * this.TableOutlineDr.TableOutline.W);
                var _b = _y + parseInt(dKoefY * this.TableOutlineDr.TableOutline.H);
                if (_x < overlay.min_x) {
                    overlay.min_x = _x;
                }
                if (_r > overlay.max_x) {
                    overlay.max_x = _r;
                }
                if (_y < overlay.min_y) {
                    overlay.min_y = _y;
                }
                if (_b > overlay.max_y) {
                    overlay.max_y = _b;
                }
                var ctx = overlay.m_oContext;
                ctx.strokeStyle = "#FFFFFF";
                ctx.beginPath();
                ctx.rect(_x, _y, _r - _x, _b - _y);
                ctx.stroke();
                ctx.strokeStyle = "#000000";
                ctx.beginPath();
                var dot_size = 3;
                for (var i = _x; i < _r; i += dot_size) {
                    ctx.moveTo(i, _y);
                    i += dot_size;
                    if (i > _r) {
                        i = _r;
                    }
                    ctx.lineTo(i, _y);
                }
                for (var i = _y; i < _b; i += dot_size) {
                    ctx.moveTo(_r, i);
                    i += dot_size;
                    if (i > _b) {
                        i = _b;
                    }
                    ctx.lineTo(_r, i);
                }
                for (var i = _r; i > _x; i -= dot_size) {
                    ctx.moveTo(i, _b);
                    i -= dot_size;
                    if (i < _x) {
                        i = _x;
                    }
                    ctx.lineTo(i, _b);
                }
                for (var i = _b; i > _y; i -= dot_size) {
                    ctx.moveTo(_x, i);
                    i -= dot_size;
                    if (i < _y) {
                        i = _y;
                    }
                    ctx.lineTo(_x, i);
                }
                ctx.stroke();
                ctx.beginPath();
            } else {
                var _x = this.TableOutlineDr.CurPos.X + _table.Get_TableOffsetCorrection();
                var _y = this.TableOutlineDr.CurPos.Y;
                var _r = _x + this.TableOutlineDr.TableOutline.W;
                var _b = _y + this.TableOutlineDr.TableOutline.H;
                var transform = this.TableOutlineDr.TableMatrix;
                var x1 = transform.TransformPointX(_x, _y);
                var y1 = transform.TransformPointY(_x, _y);
                var x2 = transform.TransformPointX(_r, _y);
                var y2 = transform.TransformPointY(_r, _y);
                var x3 = transform.TransformPointX(_r, _b);
                var y3 = transform.TransformPointY(_r, _b);
                var x4 = transform.TransformPointX(_x, _b);
                var y4 = transform.TransformPointY(_x, _b);
                overlay.CheckPoint(x1, y1);
                overlay.CheckPoint(x2, y2);
                overlay.CheckPoint(x3, y3);
                overlay.CheckPoint(x4, y4);
                var ctx = overlay.m_oContext;
                ctx.strokeStyle = "#FFFFFF";
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.lineTo(x3, y3);
                ctx.lineTo(x4, y4);
                ctx.closePath();
                ctx.stroke();
                ctx.strokeStyle = "#000000";
                ctx.beginPath();
                this.AutoShapesTrack.AddRectDash(ctx, x1, y1, x2, y2, x4, y4, x3, y3, 3, 3);
                ctx.stroke();
                ctx.beginPath();
            }
        } else {
            this.LockCursorType("default");
            var _x = global_mouseEvent.X;
            var _y = global_mouseEvent.Y;
            var posMouse = this.ConvertCoordsFromCursor2(_x, _y);
            this.TableOutlineDr.InlinePos = this.m_oWordControl.m_oLogicDocument.Get_NearestPos(posMouse.Page, posMouse.X, posMouse.Y);
            this.TableOutlineDr.InlinePos.Page = posMouse.Page;
            var _near = this.TableOutlineDr.InlinePos;
            this.AutoShapesTrack.SetCurrentPage(_near.Page);
            this.AutoShapesTrack.DrawInlineMoveCursor(_near.X, _near.Y, _near.Height, _near.transform);
        }
    };
    this.SetCurrentPage = function (PageIndex) {
        if (PageIndex >= this.m_arrPages.length) {
            return;
        }
        if (this.m_lCurrentPage == PageIndex) {
            return;
        }
        this.m_lCurrentPage = PageIndex;
        this.m_oWordControl.SetCurrentPage();
    };
    this.SelectEnabled = function (bIsEnabled) {
        this.m_bIsSelection = bIsEnabled;
        if (false === this.m_bIsSelection) {
            this.SelectClear();
            this.drawingObjects.getOverlay().m_oContext.globalAlpha = 1;
        }
    };
    this.SelectClear = function () {};
    this.SearchClear = function () {
        for (var i = 0; i < this.m_lPagesCount; i++) {
            this.m_arrPages[i].searchingArray.splice(0, this.m_arrPages[i].searchingArray.length);
        }
        this._search_HdrFtr_All.splice(0, this._search_HdrFtr_All.length);
        this._search_HdrFtr_All_no_First.splice(0, this._search_HdrFtr_All_no_First.length);
        this._search_HdrFtr_First.splice(0, this._search_HdrFtr_First.length);
        this._search_HdrFtr_Even.splice(0, this._search_HdrFtr_Even.length);
        this._search_HdrFtr_Odd.splice(0, this._search_HdrFtr_Odd.length);
        this._search_HdrFtr_Odd_no_First.splice(0, this._search_HdrFtr_Odd_no_First.length);
        this.m_oWordControl.m_oOverlayApi.Clear();
        this.m_bIsSearching = false;
        this.CurrentSearchNavi = null;
    };
    this.AddPageSearch = function (findText, rects, type) {
        var _len = rects.length;
        if (_len == 0) {
            return;
        }
        if (this.m_oWordControl.m_oOverlay.HtmlElement.style.display == "none") {
            this.m_oWordControl.ShowOverlay();
            this.m_oWordControl.m_oOverlayApi.m_oContext.globalAlpha = 0.2;
        }
        var navigator = {
            Page: rects[0].PageNum,
            Place: rects,
            Type: type
        };
        var _find = {
            text: findText,
            navigator: navigator
        };
        this.m_oWordControl.m_oApi.sync_SearchFoundCallback(_find);
        var is_update = false;
        var _type = type & 255;
        switch (_type) {
        case search_Common:
            var _pages = this.m_arrPages;
            for (var i = 0; i < _len; i++) {
                var r = rects[i];
                if (this.SearchTransform) {
                    r.Transform = this.SearchTransform;
                }
                _pages[r.PageNum].searchingArray[_pages[r.PageNum].searchingArray.length] = r;
                if (r.PageNum >= this.m_lDrawingFirst && r.PageNum <= this.m_lDrawingEnd) {
                    is_update = true;
                }
            }
            break;
        case search_HdrFtr_All:
            for (var i = 0; i < _len; i++) {
                if (this.SearchTransform) {
                    rects[i].Transform = this.SearchTransform;
                }
                this._search_HdrFtr_All[this._search_HdrFtr_All.length] = rects[i];
            }
            is_update = true;
            break;
        case search_HdrFtr_All_no_First:
            for (var i = 0; i < _len; i++) {
                if (this.SearchTransform) {
                    rects[i].Transform = this.SearchTransform;
                }
                this._search_HdrFtr_All_no_First[this._search_HdrFtr_All_no_First.length] = rects[i];
            }
            if (this.m_lDrawingEnd > 0) {
                is_update = true;
            }
            break;
        case search_HdrFtr_First:
            for (var i = 0; i < _len; i++) {
                if (this.SearchTransform) {
                    rects[i].Transform = this.SearchTransform;
                }
                this._search_HdrFtr_First[this._search_HdrFtr_First.length] = rects[i];
            }
            if (this.m_lDrawingFirst == 0) {
                is_update = true;
            }
            break;
        case search_HdrFtr_Even:
            for (var i = 0; i < _len; i++) {
                if (this.SearchTransform) {
                    rects[i].Transform = this.SearchTransform;
                }
                this._search_HdrFtr_Even[this._search_HdrFtr_Even.length] = rects[i];
            }
            var __c = this.m_lDrawingEnd - this.m_lDrawingFirst;
            if (__c > 1) {
                is_update = true;
            } else {
                if (__c == 1 && (this.m_lDrawingFirst & 1) == 1) {
                    is_update = true;
                }
            }
            break;
        case search_HdrFtr_Odd:
            for (var i = 0; i < _len; i++) {
                if (this.SearchTransform) {
                    rects[i].Transform = this.SearchTransform;
                }
                this._search_HdrFtr_Odd[this._search_HdrFtr_Odd.length] = rects[i];
            }
            var __c = this.m_lDrawingEnd - this.m_lDrawingFirst;
            if (__c > 1) {
                is_update = true;
            } else {
                if (__c == 1 && (this.m_lDrawingFirst & 1) == 0) {
                    is_update = true;
                }
            }
            break;
        case search_HdrFtr_Odd_no_First:
            for (var i = 0; i < _len; i++) {
                if (this.SearchTransform) {
                    rects[i].Transform = this.SearchTransform;
                }
                this._search_HdrFtr_Odd_no_First[this._search_HdrFtr_Odd_no_First.length] = rects[i];
            }
            if (this.m_lDrawingEnd > 1) {
                var __c = this.m_lDrawingEnd - this.m_lDrawingFirst;
                if (__c > 1) {
                    is_update = true;
                } else {
                    if (__c == 1 && (this.m_lDrawingFirst & 1) == 0) {
                        is_update = true;
                    }
                }
            }
            break;
        default:
            break;
        }
        if (is_update) {
            this.drawingObjects.OnUpdateOverlay();
        }
    };
    this.StartSearchTransform = function (transform) {
        this.SearchTransform = transform.CreateDublicate();
    };
    this.EndSearchTransform = function () {
        this.SearchTransform = null;
    };
    this.StartSearch = function () {
        this.SearchClear();
        if (this.m_bIsSelection) {
            this.m_oWordControl.OnUpdateOverlay();
        }
        this.m_bIsSearching = true;
        this.CurrentSearchNavi = null;
    };
    this.EndSearch = function (bIsChange) {
        if (bIsChange) {
            this.SearchClear();
            this.m_bIsSearching = false;
            this.m_oWordControl.OnUpdateOverlay();
        } else {
            this.m_bIsSearching = true;
            this.m_oWordControl.OnUpdateOverlay();
        }
        this.m_oWordControl.m_oApi.sync_SearchEndCallback();
    };
    this.private_StartDrawSelection = function (overlay) {
        this.Overlay = overlay;
        this.IsTextMatrixUse = ((null != this.TextMatrix) && !global_MatrixTransformer.IsIdentity(this.TextMatrix));
        this.Overlay.m_oContext.fillStyle = "rgba(51,102,204,255)";
        this.Overlay.m_oContext.beginPath();
        if (this.IsTextMatrixUse) {
            this.Overlay.m_oContext.strokeStyle = "#9ADBFE";
        }
    };
    this.private_EndDrawSelection = function () {
        var ctx = this.Overlay.m_oContext;
        ctx.globalAlpha = 0.2;
        ctx.fill();
        if (this.IsTextMatrixUse) {
            ctx.globalAlpha = 1;
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.globalAlpha = 1;
        this.IsTextMatrixUse = false;
        this.Overlay = null;
    };
    this.AddPageSelection = function (pageIndex, x, y, w, h) {
        var dKoefX = this.drawingObjects.convertMetric(1, 3, 0);
        var dKoefY = dKoefX;
        var _offX = 0;
        var _offY = 0;
        if (this.AutoShapesTrack && this.AutoShapesTrack.Graphics && this.AutoShapesTrack.Graphics.m_oCoordTransform) {
            _offX = this.AutoShapesTrack.Graphics.m_oCoordTransform.tx;
            _offY = this.AutoShapesTrack.Graphics.m_oCoordTransform.ty;
        }
        if (!this.IsTextMatrixUse) {
            var _x = ((_offX + dKoefX * x) >> 0) - 0.5;
            var _y = ((_offY + dKoefY * y) >> 0) - 0.5;
            var _w = (dKoefX * w + 1) >> 0;
            var _h = (dKoefY * h + 1) >> 0;
            this.Overlay.CheckRect(_x, _y, _w, _h);
            this.Overlay.m_oContext.rect(_x, _y, _w, _h);
        } else {
            var _x1 = this.TextMatrix.TransformPointX(x, y);
            var _y1 = this.TextMatrix.TransformPointY(x, y);
            var _x2 = this.TextMatrix.TransformPointX(x + w, y);
            var _y2 = this.TextMatrix.TransformPointY(x + w, y);
            var _x3 = this.TextMatrix.TransformPointX(x + w, y + h);
            var _y3 = this.TextMatrix.TransformPointY(x + w, y + h);
            var _x4 = this.TextMatrix.TransformPointX(x, y + h);
            var _y4 = this.TextMatrix.TransformPointY(x, y + h);
            var x1 = _offX + dKoefX * _x1;
            var y1 = _offY + dKoefY * _y1;
            var x2 = _offX + dKoefX * _x2;
            var y2 = _offY + dKoefY * _y2;
            var x3 = _offX + dKoefX * _x3;
            var y3 = _offY + dKoefY * _y3;
            var x4 = _offX + dKoefX * _x4;
            var y4 = _offY + dKoefY * _y4;
            this.Overlay.CheckPoint(x1, y1);
            this.Overlay.CheckPoint(x2, y2);
            this.Overlay.CheckPoint(x3, y3);
            this.Overlay.CheckPoint(x4, y4);
            var ctx = this.Overlay.m_oContext;
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.lineTo(x4, y4);
            ctx.closePath();
        }
    };
    this.AddPageSelection2 = function (pageIndex, x, y, width, height) {
        if (Math.abs(width) < 0.001 || Math.abs(height) < 0.001) {
            return;
        }
        if (undefined === this.m_arrPages[pageIndex]) {
            this.m_arrPages[pageIndex] = new CPage();
        }
        if (this.min_PageAddSelection > pageIndex) {
            this.min_PageAddSelection = pageIndex;
        }
        if (this.max_PageAddSelection < pageIndex) {
            this.max_PageAddSelection = pageIndex;
        }
        if (this.m_bIsSelection && (this.m_oWordControl.m_oOverlay.HtmlElement.style.display == "none")) {
            this.m_oWordControl.ShowOverlay();
            this.m_oWordControl.m_oOverlayApi.m_oContext.globalAlpha = 0.2;
        }
        var r = new _rect();
        r.x = x;
        r.y = y;
        r.w = width;
        r.h = height;
        this.m_arrPages[pageIndex].selectionArray[this.m_arrPages[pageIndex].selectionArray.length] = r;
        if (this.m_oWordControl.MobileTouchManager) {
            if (null == this.m_oWordControl.MobileTouchManager.RectSelect1) {
                this.m_oWordControl.MobileTouchManager.RectSelect1 = r;
                this.m_oWordControl.MobileTouchManager.PageSelect1 = pageIndex;
            }
            this.m_oWordControl.MobileTouchManager.RectSelect2 = r;
            this.m_oWordControl.MobileTouchManager.PageSelect2 = pageIndex;
        }
    };
    this.AddPageSelection2 = function (pageIndex, x, y, width, height) {
        if (Math.abs(width) < 0.001 || Math.abs(height) < 0.001) {
            return;
        }
        if (undefined === this.m_arrPages[pageIndex]) {
            this.m_arrPages[pageIndex] = new CPage();
        }
        if (this.min_PageAddSelection > pageIndex) {
            this.min_PageAddSelection = pageIndex;
        }
        if (this.max_PageAddSelection < pageIndex) {
            this.max_PageAddSelection = pageIndex;
        }
        if (this.m_bIsSelection && (this.m_oWordControl.m_oOverlay.HtmlElement.style.display == "none")) {
            this.m_oWordControl.ShowOverlay();
            this.m_oWordControl.m_oOverlayApi.m_oContext.globalAlpha = 0.2;
        }
        var r = new _rect();
        r.x = x;
        r.y = y;
        r.w = width;
        r.h = height;
        this.m_arrPages[pageIndex].selectionArray[this.m_arrPages[pageIndex].selectionArray.length] = r;
        if (this.m_oWordControl.MobileTouchManager) {
            if (null == this.m_oWordControl.MobileTouchManager.RectSelect1) {
                this.m_oWordControl.MobileTouchManager.RectSelect1 = r;
                this.m_oWordControl.MobileTouchManager.PageSelect1 = pageIndex;
            }
            this.m_oWordControl.MobileTouchManager.RectSelect2 = r;
            this.m_oWordControl.MobileTouchManager.PageSelect2 = pageIndex;
        }
    };
    this.SelectShow = function () {
        this.drawingObjects.OnUpdateOverlay();
    };
    this.Set_RulerState_Table = function (markup, transform) {
        var hor_ruler = this.m_oWordControl.m_oHorRuler;
        var ver_ruler = this.m_oWordControl.m_oVerRuler;
        hor_ruler.CurrentObjectType = RULER_OBJECT_TYPE_TABLE;
        hor_ruler.m_oTableMarkup = markup.CreateDublicate();
        ver_ruler.CurrentObjectType = RULER_OBJECT_TYPE_TABLE;
        ver_ruler.m_oTableMarkup = markup.CreateDublicate();
        this.TableOutlineDr.TableMatrix = null;
        this.TableOutlineDr.CurrentPageIndex = this.m_lCurrentPage;
        if (transform) {
            hor_ruler.m_oTableMarkup.TransformX = transform.tx;
            hor_ruler.m_oTableMarkup.TransformY = transform.ty;
            ver_ruler.m_oTableMarkup.TransformX = transform.tx;
            ver_ruler.m_oTableMarkup.TransformY = transform.ty;
            hor_ruler.m_oTableMarkup.CorrectFrom();
            ver_ruler.m_oTableMarkup.CorrectFrom();
            this.TableOutlineDr.TableMatrix = transform.CreateDublicate();
        }
        hor_ruler.CalculateMargins();
        if (0 <= this.m_lCurrentPage && this.m_lCurrentPage < this.m_lPagesCount) {
            hor_ruler.CreateBackground(this.m_arrPages[this.m_lCurrentPage]);
            ver_ruler.CreateBackground(this.m_arrPages[this.m_lCurrentPage]);
        }
        this.m_oWordControl.UpdateHorRuler();
        this.m_oWordControl.UpdateVerRuler();
        if (this.m_oWordControl.MobileTouchManager) {
            this.m_oWordControl.MobileTouchManager.TableStartTrack_Check = true;
            markup.Table.Start_TrackTable();
            this.m_oWordControl.MobileTouchManager.TableStartTrack_Check = false;
        }
    };
    this.Set_RulerState_Paragraph = function (margins) {
        var hor_ruler = this.m_oWordControl.m_oHorRuler;
        var ver_ruler = this.m_oWordControl.m_oVerRuler;
        if (hor_ruler.CurrentObjectType == RULER_OBJECT_TYPE_PARAGRAPH && ver_ruler.CurrentObjectType == RULER_OBJECT_TYPE_PARAGRAPH) {
            if ((margins && !hor_ruler.IsCanMoveMargins) || (!margins && hor_ruler.IsCanMoveMargins)) {
                var bIsNeedUpdate = false;
                if (margins && this.LastParagraphMargins) {
                    if (margins.L != this.LastParagraphMargins.L || margins.T != this.LastParagraphMargins.T || margins.R != this.LastParagraphMargins.R || margins.B != this.LastParagraphMargins.B) {
                        bIsNeedUpdate = true;
                    }
                }
                if (!bIsNeedUpdate) {
                    return;
                }
            }
        }
        hor_ruler.CurrentObjectType = RULER_OBJECT_TYPE_PARAGRAPH;
        hor_ruler.m_oTableMarkup = null;
        ver_ruler.CurrentObjectType = RULER_OBJECT_TYPE_PARAGRAPH;
        ver_ruler.m_oTableMarkup = null;
        if (-1 != this.m_lCurrentPage) {
            if (margins) {
                var cachedPage = {};
                cachedPage.width_mm = this.m_arrPages[this.m_lCurrentPage].width_mm;
                cachedPage.height_mm = this.m_arrPages[this.m_lCurrentPage].height_mm;
                cachedPage.margin_left = margins.L;
                cachedPage.margin_top = margins.T;
                cachedPage.margin_right = margins.R;
                cachedPage.margin_bottom = margins.B;
                hor_ruler.CreateBackground(cachedPage);
                ver_ruler.CreateBackground(cachedPage);
                hor_ruler.IsCanMoveMargins = false;
                ver_ruler.IsCanMoveMargins = false;
                this.LastParagraphMargins = {};
                this.LastParagraphMargins.L = margins.L;
                this.LastParagraphMargins.T = margins.T;
                this.LastParagraphMargins.R = margins.R;
                this.LastParagraphMargins.B = margins.B;
            } else {
                hor_ruler.CreateBackground(this.m_arrPages[this.m_lCurrentPage]);
                ver_ruler.CreateBackground(this.m_arrPages[this.m_lCurrentPage]);
                hor_ruler.IsCanMoveMargins = true;
                ver_ruler.IsCanMoveMargins = true;
                this.LastParagraphMargins = null;
            }
        }
        this.m_oWordControl.UpdateHorRuler();
        this.m_oWordControl.UpdateVerRuler();
    };
    this.Set_RulerState_HdrFtr = function (bHeader, Y0, Y1) {
        var hor_ruler = this.m_oWordControl.m_oHorRuler;
        var ver_ruler = this.m_oWordControl.m_oVerRuler;
        hor_ruler.CurrentObjectType = RULER_OBJECT_TYPE_PARAGRAPH;
        hor_ruler.m_oTableMarkup = null;
        ver_ruler.CurrentObjectType = (true === bHeader) ? RULER_OBJECT_TYPE_HEADER : RULER_OBJECT_TYPE_FOOTER;
        ver_ruler.header_top = Y0;
        ver_ruler.header_bottom = Y1;
        ver_ruler.m_oTableMarkup = null;
        if (-1 != this.m_lCurrentPage) {
            hor_ruler.CreateBackground(this.m_arrPages[this.m_lCurrentPage]);
            ver_ruler.CreateBackground(this.m_arrPages[this.m_lCurrentPage]);
        }
        this.m_oWordControl.UpdateHorRuler();
        this.m_oWordControl.UpdateVerRuler();
    };
    this.Update_ParaTab = function (Default_Tab, ParaTabs) {
        var hor_ruler = this.m_oWordControl.m_oHorRuler;
        var __tabs = ParaTabs.Tabs;
        if (undefined === __tabs) {
            __tabs = ParaTabs;
        }
        var _len = __tabs.length;
        if ((Default_Tab == hor_ruler.m_dDefaultTab) && (hor_ruler.m_arrTabs.length == _len) && (_len == 0)) {
            return;
        }
        hor_ruler.m_dDefaultTab = Default_Tab;
        hor_ruler.m_arrTabs = [];
        var _ar = hor_ruler.m_arrTabs;
        for (var i = 0; i < _len; i++) {
            if (__tabs[i].Value == tab_Left) {
                _ar[i] = new CTab(__tabs[i].Pos, g_tabtype_left);
            } else {
                if (__tabs[i].Value == tab_Center) {
                    _ar[i] = new CTab(__tabs[i].Pos, g_tabtype_center);
                } else {
                    if (__tabs[i].Value == tab_Right) {
                        _ar[i] = new CTab(__tabs[i].Pos, g_tabtype_right);
                    }
                }
            }
        }
        hor_ruler.CorrectTabs();
        this.m_oWordControl.UpdateHorRuler();
    };
    this.UpdateTableRuler = function (isCols, index, position) {
        var dKoef_mm_to_pix = g_dKoef_mm_to_pix * this.m_oWordControl.m_nZoomValue / 100;
        if (false === isCols) {
            var markup = this.m_oWordControl.m_oVerRuler.m_oTableMarkup;
            if (markup == null) {
                return;
            }
            position += markup.TransformY;
            if (0 == index) {
                var delta = position - markup.Rows[0].Y;
                markup.Rows[0].Y = position;
                markup.Rows[0].H -= delta;
            } else {
                var delta = (markup.Rows[index - 1].Y + markup.Rows[index - 1].H) - position;
                markup.Rows[index - 1].H -= delta;
                if (index != markup.Rows.length) {
                    markup.Rows[index].Y -= delta;
                    markup.Rows[index].H += delta;
                }
            }
            if ("none" == this.m_oWordControl.m_oOverlay.HtmlElement.style.display) {
                this.m_oWordControl.ShowOverlay();
            }
            this.m_oWordControl.UpdateVerRulerBack();
            this.m_oWordControl.m_oOverlayApi.HorLine(this.m_arrPages[this.m_lCurrentPage].drawingPage.top + position * dKoef_mm_to_pix);
        } else {
            var markup = this.m_oWordControl.m_oHorRuler.m_oTableMarkup;
            if (markup == null) {
                return;
            }
            position += markup.TransformX;
            if (0 == index) {
                markup.X = position;
            } else {
                var _start = markup.X;
                for (var i = 0; i < (index - 1); i++) {
                    _start += markup.Cols[i];
                }
                var _old = markup.Cols[index - 1];
                markup.Cols[index - 1] = position - _start;
                if (index != markup.Cols.length) {
                    markup.Cols[index] += (_old - markup.Cols[index - 1]);
                }
            }
            if ("none" == this.m_oWordControl.m_oOverlay.HtmlElement.style.display) {
                this.m_oWordControl.ShowOverlay();
            }
            this.m_oWordControl.UpdateHorRulerBack();
            this.m_oWordControl.m_oOverlayApi.VertLine(this.m_arrPages[this.m_lCurrentPage].drawingPage.left + position * dKoef_mm_to_pix);
        }
    };
    this.GetDotsPerMM = function (value) {
        return value * this.m_oWordControl.m_nZoomValue * g_dKoef_mm_to_pix / 100;
    };
    this.GetMMPerDot = function (value) {
        return value / this.GetDotsPerMM(1);
    };
    this.GetVisibleMMHeight = function () {
        var pixHeigth = this.m_oWordControl.m_oEditor.HtmlElement.height;
        var pixBetweenPages = 20 * (this.m_lDrawingEnd - this.m_lDrawingFirst);
        return (pixHeigth - pixBetweenPages) * g_dKoef_pix_to_mm * 100 / this.m_oWordControl.m_nZoomValue;
    };
    this.CheckFontCache = function () {
        var map_used = this.m_oWordControl.m_oLogicDocument.Document_CreateFontMap();
        var _measure_map = g_oTextMeasurer.m_oManager.m_oFontsCache.Fonts;
        var _drawing_map = g_fontManager.m_oFontsCache.Fonts;
        var map_keys = {};
        var api = this.m_oWordControl.m_oApi;
        for (var i in map_used) {
            var key = GenerateMapId(api, map_used[i].Name, map_used[i].Style, map_used[i].Size);
            map_keys[key] = true;
        }
        for (var i in _measure_map) {
            if (map_keys[i] == undefined) {
                delete _measure_map[i];
            }
        }
        for (var i in _drawing_map) {
            if (map_keys[i] == undefined) {
                if (null != _drawing_map[i]) {
                    _drawing_map[i].Destroy();
                }
                delete _drawing_map[i];
            }
        }
    };
    this.CheckFontNeeds = function () {
        var map_keys = this.m_oWordControl.m_oLogicDocument.Document_Get_AllFontNames();
        var dstfonts = [];
        for (var i in map_keys) {
            dstfonts[dstfonts.length] = new CFont(i, 0, "", 0, null);
        }
        this.m_oWordControl.m_oLogicDocument.Fonts = dstfonts;
        return;
    };
    this.OpenDocument = function () {
        this.m_oDocumentRenderer.InitDocument(this);
        this.m_oWordControl.CalculateDocumentSize();
        this.m_oWordControl.OnScroll();
    };
    this.DrawTrack = function (type, matrix, left, top, width, height, isLine, canRotate, isNoMove) {
        this.AutoShapesTrack.DrawTrack(type, matrix, left, top, width, height, isLine, canRotate, isNoMove);
    };
    this.DrawTrackSelectShapes = function (x, y, w, h) {
        this.AutoShapesTrack.DrawTrackSelectShapes(x, y, w, h);
    };
    this.DrawAdjustment = function (matrix, x, y) {
        this.AutoShapesTrack.DrawAdjustment(matrix, x, y);
    };
    this.LockTrackPageNum = function (nPageNum) {
        this.AutoShapesTrackLockPageNum = nPageNum;
    };
    this.UnlockTrackPageNum = function () {
        this.AutoShapesTrackLockPageNum = -1;
    };
    this.CheckGuiControlColors = function () {
        var _theme = this.m_oWordControl.m_oLogicDocument.theme;
        var _clrMap = this.m_oWordControl.m_oLogicDocument.clrSchemeMap.color_map;
        var arr_colors = new Array(10);
        var rgba = {
            R: 0,
            G: 0,
            B: 0,
            A: 255
        };
        var array_colors_types = [6, 15, 7, 16, 0, 1, 2, 3, 4, 5];
        var _count = array_colors_types.length;
        var color = new CUniColor();
        color.color = new CSchemeColor();
        for (var i = 0; i < _count; ++i) {
            color.color.id = array_colors_types[i];
            color.Calculate(_theme, _clrMap, rgba);
            var _rgba = color.RGBA;
            arr_colors[i] = new CColor(_rgba.R, _rgba.G, _rgba.B);
        }
        var bIsSend = false;
        if (this.GuiControlColorsMap != null) {
            for (var i = 0; i < _count; ++i) {
                var _color1 = this.GuiControlColorsMap[i];
                var _color2 = arr_colors[i];
                if ((_color1.r != _color2.r) || (_color1.g != _color2.g) || (_color1.b != _color2.b)) {
                    bIsSend = true;
                    break;
                }
            }
        } else {
            this.GuiControlColorsMap = new Array(_count);
            bIsSend = true;
        }
        if (bIsSend) {
            for (var i = 0; i < _count; ++i) {
                this.GuiControlColorsMap[i] = arr_colors[i];
            }
            this.SendControlColors();
        }
    };
    this.SendControlColors = function () {
        var standart_colors = null;
        if (!this.IsSendStandartColors) {
            var _c_s = g_oStandartColors.length;
            standart_colors = new Array(_c_s);
            for (var i = 0; i < _c_s; ++i) {
                standart_colors[i] = new CColor(g_oStandartColors[i]["R"], g_oStandartColors[i]["G"], g_oStandartColors[i]["B"]);
            }
            this.IsSendStandartColors = true;
        }
        var _count = this.GuiControlColorsMap.length;
        var _ret_array = new Array(_count * 6);
        var _cur_index = 0;
        for (var i = 0; i < _count; ++i) {
            var _color_src = this.GuiControlColorsMap[i];
            _ret_array[_cur_index] = new CColor(_color_src.r, _color_src.g, _color_src.b);
            _cur_index++;
            var _count_mods = 5;
            for (var j = 0; j < _count_mods; ++j) {
                var dst_mods = new CColorModifiers();
                dst_mods.Mods = _create_mods(GetDefaultMods(_color_src.r, _color_src.g, _color_src.b, j + 1, 2));
                var _rgba = {
                    R: _color_src.r,
                    G: _color_src.g,
                    B: _color_src.b,
                    A: 255
                };
                dst_mods.Apply(_rgba);
                _ret_array[_cur_index] = new CColor(_rgba.R, _rgba.G, _rgba.B);
                _cur_index++;
            }
        }
        this.m_oWordControl.m_oApi.sync_SendThemeColors(_ret_array, standart_colors);
    };
    this.SendThemeColorScheme = function () {
        var infos = [];
        var _index = 0;
        var _c = null;
        var _count_defaults = g_oUserColorScheme.length;
        for (var i = 0; i < _count_defaults; ++i) {
            var _obj = g_oUserColorScheme[i];
            infos[_index] = new CAscColorScheme();
            infos[_index].Name = _obj["name"];
            _c = _obj["dk1"];
            infos[_index].Colors[0] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["lt1"];
            infos[_index].Colors[1] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["dk2"];
            infos[_index].Colors[2] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["lt2"];
            infos[_index].Colors[3] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["accent1"];
            infos[_index].Colors[4] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["accent2"];
            infos[_index].Colors[5] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["accent3"];
            infos[_index].Colors[6] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["accent4"];
            infos[_index].Colors[7] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["accent5"];
            infos[_index].Colors[8] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["accent6"];
            infos[_index].Colors[9] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["hlink"];
            infos[_index].Colors[10] = new CColor(_c["R"], _c["G"], _c["B"]);
            _c = _obj["folHlink"];
            infos[_index].Colors[11] = new CColor(_c["R"], _c["G"], _c["B"]);
            ++_index;
        }
        var _theme = this.m_oWordControl.m_oLogicDocument.theme;
        var _extra = _theme.extraClrSchemeLst;
        var _count = _extra.length;
        var _rgba = {
            R: 0,
            G: 0,
            B: 0,
            A: 255
        };
        for (var i = 0; i < _count; ++i) {
            var _scheme = _extra[i].clrScheme;
            infos[_index] = new CAscColorScheme();
            infos[_index].Name = _scheme.name;
            _scheme.colors[8].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[8].RGBA;
            infos[_index].Colors[0] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[12].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[12].RGBA;
            infos[_index].Colors[1] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[9].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[9].RGBA;
            infos[_index].Colors[2] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[13].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[13].RGBA;
            infos[_index].Colors[3] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[0].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[0].RGBA;
            infos[_index].Colors[4] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[1].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[1].RGBA;
            infos[_index].Colors[5] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[2].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[2].RGBA;
            infos[_index].Colors[6] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[3].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[3].RGBA;
            infos[_index].Colors[7] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[4].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[4].RGBA;
            infos[_index].Colors[8] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[5].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[5].RGBA;
            infos[_index].Colors[9] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[11].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[11].RGBA;
            infos[_index].Colors[10] = new CColor(_c.R, _c.G, _c.B);
            _scheme.colors[10].Calculate(_theme, null, null, null, _rgba);
            _c = _scheme.colors[10].RGBA;
            infos[_index].Colors[11] = new CColor(_c.R, _c.G, _c.B);
            _index++;
        }
        this.m_oWordControl.m_oApi.sync_SendThemeColorSchemes(infos);
    };
    this.DrawImageTextureFillShape = function (url) {
        if (this.GuiCanvasFillTexture == null) {
            this.InitGuiCanvasShape(this.GuiCanvasFillTextureParentId);
        }
        if (this.GuiCanvasFillTexture == null || this.GuiCanvasFillTextureCtx == null || url == this.LastDrawingUrl) {
            return;
        }
        this.LastDrawingUrl = url;
        var _width = this.GuiCanvasFillTexture.width;
        var _height = this.GuiCanvasFillTexture.height;
        this.GuiCanvasFillTextureCtx.clearRect(0, 0, _width, _height);
        if (null == this.LastDrawingUrl) {
            return;
        }
        var api = window["Asc"]["editor"];
        var _img = api.ImageLoader.map_image_index[getFullImageSrc(this.LastDrawingUrl)];
        if (_img != undefined && _img.Image != null && _img.Status != ImageLoadStatus.Loading) {
            var _x = 0;
            var _y = 0;
            var _w = Math.max(_img.Image.width, 1);
            var _h = Math.max(_img.Image.height, 1);
            var dAspect1 = _width / _height;
            var dAspect2 = _w / _h;
            _w = _width;
            _h = _height;
            if (dAspect1 >= dAspect2) {
                _w = dAspect2 * _height;
                _x = (_width - _w) / 2;
            } else {
                _h = _w / dAspect2;
                _y = (_height - _h) / 2;
            }
            this.GuiCanvasFillTextureCtx.drawImage(_img.Image, _x, _y, _w, _h);
        } else {
            this.GuiCanvasFillTextureCtx.lineWidth = 1;
            this.GuiCanvasFillTextureCtx.beginPath();
            this.GuiCanvasFillTextureCtx.moveTo(0, 0);
            this.GuiCanvasFillTextureCtx.lineTo(_width, _height);
            this.GuiCanvasFillTextureCtx.moveTo(_width, 0);
            this.GuiCanvasFillTextureCtx.lineTo(0, _height);
            this.GuiCanvasFillTextureCtx.strokeStyle = "#FF0000";
            this.GuiCanvasFillTextureCtx.stroke();
            this.GuiCanvasFillTextureCtx.beginPath();
            this.GuiCanvasFillTextureCtx.moveTo(0, 0);
            this.GuiCanvasFillTextureCtx.lineTo(_width, 0);
            this.GuiCanvasFillTextureCtx.lineTo(_width, _height);
            this.GuiCanvasFillTextureCtx.lineTo(0, _height);
            this.GuiCanvasFillTextureCtx.closePath();
            this.GuiCanvasFillTextureCtx.strokeStyle = "#000000";
            this.GuiCanvasFillTextureCtx.stroke();
            this.GuiCanvasFillTextureCtx.beginPath();
        }
    };
    this.InitGuiCanvasShape = function (div_id) {
        if (this.GuiCanvasFillTextureParentId == div_id && null != this.GuiCanvasFillTexture) {
            return;
        }
        if (null != this.GuiCanvasFillTexture) {
            var _div_elem = document.getElementById(this.GuiCanvasFillTextureParentId);
            if (_div_elem) {
                _div_elem.removeChild(this.GuiCanvasFillTexture);
            }
            this.GuiCanvasFillTexture = null;
            this.GuiCanvasFillTextureCtx = null;
        }
        this.GuiCanvasFillTextureParentId = div_id;
        var _div_elem = document.getElementById(this.GuiCanvasFillTextureParentId);
        if (!_div_elem) {
            return;
        }
        var bIsAppend = true;
        if (_div_elem.childNodes && _div_elem.childNodes.length == 1) {
            this.GuiCanvasFillTexture = _div_elem.childNodes[0];
            bIsAppend = false;
        } else {
            this.GuiCanvasFillTexture = document.createElement("canvas");
        }
        this.GuiCanvasFillTexture.width = parseInt(_div_elem.style.width);
        this.GuiCanvasFillTexture.height = parseInt(_div_elem.style.height);
        this.LastDrawingUrl = "";
        this.GuiCanvasFillTextureCtx = this.GuiCanvasFillTexture.getContext("2d");
        if (bIsAppend) {
            _div_elem.appendChild(this.GuiCanvasFillTexture);
        }
    };
    this.InitGuiCanvasTextProps = function (div_id) {
        var _div_elem = document.getElementById(div_id);
        if (null != this.GuiCanvasTextProps) {
            var elem = _div_elem.getElementsByTagName("canvas");
            if (elem.length == 0) {
                _div_elem.appendChild(this.GuiCanvasTextProps);
            } else {
                var _width = parseInt(_div_elem.offsetWidth);
                var _height = parseInt(_div_elem.offsetHeight);
                if (0 == _width) {
                    _width = 300;
                }
                if (0 == _height) {
                    _height = 80;
                }
                if (this.GuiCanvasTextProps.width != _width || this.GuiCanvasTextProps.height != _height) {
                    this.GuiCanvasTextProps.width = _width;
                    this.GuiCanvasTextProps.height = _height;
                }
            }
        } else {
            this.GuiCanvasTextProps = document.createElement("canvas");
            this.GuiCanvasTextProps.style = "position:absolute;left:0;top:0;";
            this.GuiCanvasTextProps.id = this.GuiCanvasTextPropsId;
            var _width = parseInt(_div_elem.offsetWidth);
            var _height = parseInt(_div_elem.offsetHeight);
            if (0 == _width) {
                _width = 300;
            }
            if (0 == _height) {
                _height = 80;
            }
            this.GuiCanvasTextProps.width = _width;
            this.GuiCanvasTextProps.height = _height;
            _div_elem.appendChild(this.GuiCanvasTextProps);
        }
    };
    this.DrawGuiCanvasTextProps = function (props) {
        var bIsChange = false;
        if (null == this.GuiLastTextProps) {
            bIsChange = true;
            this.GuiLastTextProps = new asc_CParagraphProperty();
            this.GuiLastTextProps.Subscript = props.Subscript;
            this.GuiLastTextProps.Superscript = props.Superscript;
            this.GuiLastTextProps.SmallCaps = props.SmallCaps;
            this.GuiLastTextProps.AllCaps = props.AllCaps;
            this.GuiLastTextProps.Strikeout = props.Strikeout;
            this.GuiLastTextProps.DStrikeout = props.DStrikeout;
            this.GuiLastTextProps.TextSpacing = props.TextSpacing;
            this.GuiLastTextProps.Position = props.Position;
        } else {
            if (this.GuiLastTextProps.Subscript != props.Subscript) {
                this.GuiLastTextProps.Subscript = props.Subscript;
                bIsChange = true;
            }
            if (this.GuiLastTextProps.Superscript != props.Superscript) {
                this.GuiLastTextProps.Superscript = props.Superscript;
                bIsChange = true;
            }
            if (this.GuiLastTextProps.SmallCaps != props.SmallCaps) {
                this.GuiLastTextProps.SmallCaps = props.SmallCaps;
                bIsChange = true;
            }
            if (this.GuiLastTextProps.AllCaps != props.AllCaps) {
                this.GuiLastTextProps.AllCaps = props.AllCaps;
                bIsChange = true;
            }
            if (this.GuiLastTextProps.Strikeout != props.Strikeout) {
                this.GuiLastTextProps.Strikeout = props.Strikeout;
                bIsChange = true;
            }
            if (this.GuiLastTextProps.DStrikeout != props.DStrikeout) {
                this.GuiLastTextProps.DStrikeout = props.DStrikeout;
                bIsChange = true;
            }
            if (this.GuiLastTextProps.TextSpacing != props.TextSpacing) {
                this.GuiLastTextProps.TextSpacing = props.TextSpacing;
                bIsChange = true;
            }
            if (this.GuiLastTextProps.Position != props.Position) {
                this.GuiLastTextProps.Position = props.Position;
                bIsChange = true;
            }
        }
        if (undefined !== this.GuiLastTextProps.Position && isNaN(this.GuiLastTextProps.Position)) {
            this.GuiLastTextProps.Position = undefined;
        }
        if (undefined !== this.GuiLastTextProps.TextSpacing && isNaN(this.GuiLastTextProps.TextSpacing)) {
            this.GuiLastTextProps.TextSpacing = undefined;
        }
        if (!bIsChange) {
            return;
        }
        ExecuteNoHistory(function () {
            var shape = new CShape();
            shape.setTxBody(CreateTextBodyFromString("", this, shape));
            var par = shape.txBody.content.Content[0];
            par.Reset(0, 0, 1000, 1000, 0);
            par.Cursor_MoveToStartPos();
            var _paraPr = new CParaPr();
            par.Pr = _paraPr;
            var _textPr = new CTextPr();
            _textPr.FontFamily = {
                Name: "Arial",
                Index: -1
            };
            _textPr.Strikeout = this.GuiLastTextProps.Strikeout;
            if (true === this.GuiLastTextProps.Subscript) {
                _textPr.VertAlign = vertalign_SubScript;
            } else {
                if (true === this.GuiLastTextProps.Superscript) {
                    _textPr.VertAlign = vertalign_SuperScript;
                } else {
                    _textPr.VertAlign = vertalign_Baseline;
                }
            }
            _textPr.DStrikeout = this.GuiLastTextProps.DStrikeout;
            _textPr.Caps = this.GuiLastTextProps.AllCaps;
            _textPr.SmallCaps = this.GuiLastTextProps.SmallCaps;
            _textPr.Spacing = this.GuiLastTextProps.TextSpacing;
            _textPr.Position = this.GuiLastTextProps.Position;
            var parRun = new ParaRun(par);
            var Pos = 0;
            parRun.Set_Pr(_textPr);
            parRun.Add_ToContent(Pos++, new ParaText("H"), false);
            parRun.Add_ToContent(Pos++, new ParaText("e"), false);
            parRun.Add_ToContent(Pos++, new ParaText("l"), false);
            parRun.Add_ToContent(Pos++, new ParaText("l"), false);
            parRun.Add_ToContent(Pos++, new ParaText("o"), false);
            parRun.Add_ToContent(Pos++, new ParaSpace(1), false);
            parRun.Add_ToContent(Pos++, new ParaText("W"), false);
            parRun.Add_ToContent(Pos++, new ParaText("o"), false);
            parRun.Add_ToContent(Pos++, new ParaText("r"), false);
            parRun.Add_ToContent(Pos++, new ParaText("l"), false);
            parRun.Add_ToContent(Pos++, new ParaText("d"), false);
            par.Add_ToContent(0, parRun);
            par.Recalculate_Page(0);
            par.Recalculate_Page(0);
            var baseLineOffset = par.Lines[0].Y;
            var _bounds = par.Get_PageBounds(0);
            var ctx = this.GuiCanvasTextProps.getContext("2d");
            var _wPx = this.GuiCanvasTextProps.width;
            var _hPx = this.GuiCanvasTextProps.height;
            var _wMm = _wPx * g_dKoef_pix_to_mm;
            var _hMm = _hPx * g_dKoef_pix_to_mm;
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, _wPx, _hPx);
            var _pxBoundsW = par.Lines[0].Ranges[0].W * g_dKoef_mm_to_pix;
            var _pxBoundsH = (_bounds.Bottom - _bounds.Top) * g_dKoef_mm_to_pix;
            if (this.GuiLastTextProps.Position !== undefined && this.GuiLastTextProps.Position != null && this.GuiLastTextProps.Position != 0) {}
            if (_pxBoundsH < _hPx && _pxBoundsW < _wPx) {
                var _lineY = (((_hPx + _pxBoundsH) / 2) >> 0) + 0.5;
                var _lineW = (((_wPx - _pxBoundsW) / 4) >> 0);
                ctx.strokeStyle = "#000000";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, _lineY);
                ctx.lineTo(_lineW, _lineY);
                ctx.moveTo(_wPx - _lineW, _lineY);
                ctx.lineTo(_wPx, _lineY);
                ctx.stroke();
                ctx.beginPath();
            }
            var _yOffset = (((_hPx + _pxBoundsH) / 2) - baseLineOffset * g_dKoef_mm_to_pix) >> 0;
            var _xOffset = ((_wPx - _pxBoundsW) / 2) >> 0;
            var graphics = new CGraphics();
            graphics.init(ctx, _wPx, _hPx, _wMm, _hMm);
            graphics.m_oFontManager = g_fontManager;
            graphics.m_oCoordTransform.tx = _xOffset;
            graphics.m_oCoordTransform.ty = _yOffset;
            graphics.transform(1, 0, 0, 1, 0, 0);
            par.Draw(0, graphics);
        },
        this, []);
    };
    this.CheckTableStyles = function (tableLook) {
        if (!this.m_oWordControl.m_oApi.asc_checkNeedCallback("asc_onInitTableTemplates")) {
            return;
        }
        var bIsChanged = false;
        if (null == this.TableStylesLastLook) {
            this.TableStylesLastLook = new CTablePropLook();
            this.TableStylesLastLook.FirstCol = tableLook.FirstCol;
            this.TableStylesLastLook.FirstRow = tableLook.FirstRow;
            this.TableStylesLastLook.LastCol = tableLook.LastCol;
            this.TableStylesLastLook.LastRow = tableLook.LastRow;
            this.TableStylesLastLook.BandHor = tableLook.BandHor;
            this.TableStylesLastLook.BandVer = tableLook.BandVer;
            bIsChanged = true;
        } else {
            if (this.TableStylesLastLook.FirstCol != tableLook.FirstCol) {
                this.TableStylesLastLook.FirstCol = tableLook.FirstCol;
                bIsChanged = true;
            }
            if (this.TableStylesLastLook.FirstRow != tableLook.FirstRow) {
                this.TableStylesLastLook.FirstRow = tableLook.FirstRow;
                bIsChanged = true;
            }
            if (this.TableStylesLastLook.LastCol != tableLook.LastCol) {
                this.TableStylesLastLook.LastCol = tableLook.LastCol;
                bIsChanged = true;
            }
            if (this.TableStylesLastLook.LastRow != tableLook.LastRow) {
                this.TableStylesLastLook.LastRow = tableLook.LastRow;
                bIsChanged = true;
            }
            if (this.TableStylesLastLook.BandHor != tableLook.BandHor) {
                this.TableStylesLastLook.BandHor = tableLook.BandHor;
                bIsChanged = true;
            }
            if (this.TableStylesLastLook.BandVer != tableLook.BandVer) {
                this.TableStylesLastLook.BandVer = tableLook.BandVer;
                bIsChanged = true;
            }
        }
        if (!bIsChanged) {
            return;
        }
        var logicDoc = this.m_oWordControl.m_oLogicDocument;
        var _dst_styles = [];
        var _styles = logicDoc.Styles.Get_AllTableStyles();
        var _styles_len = _styles.length;
        if (_styles_len == 0) {
            return _dst_styles;
        }
        var _x_mar = 10;
        var _y_mar = 10;
        var _r_mar = 10;
        var _b_mar = 10;
        var _pageW = 297;
        var _pageH = 210;
        var W = (_pageW - _x_mar - _r_mar);
        var H = (_pageH - _y_mar - _b_mar);
        var Grid = [];
        var Rows = 5;
        var Cols = 5;
        for (var i = 0; i < Cols; i++) {
            Grid[i] = W / Cols;
        }
        var _canvas = document.createElement("canvas");
        _canvas.width = TABLE_STYLE_WIDTH_PIX;
        _canvas.height = TABLE_STYLE_HEIGHT_PIX;
        var ctx = _canvas.getContext("2d");
        History.TurnOff();
        for (var i1 = 0; i1 < _styles_len; i1++) {
            var i = _styles[i1];
            var _style = logicDoc.Styles.Style[i];
            if (!_style || _style.Type != styletype_Table) {
                continue;
            }
            var table = new CTable(this, logicDoc, true, 0, _x_mar, _y_mar, 1000, 1000, Rows, Cols, Grid);
            table.Set_Props({
                TableStyle: i,
                TableLook: tableLook
            });
            for (var j = 0; j < Rows; j++) {
                table.Content[j].Set_Height(H / Rows, heightrule_AtLeast);
            }
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, _canvas.width, _canvas.height);
            var graphics = new CGraphics();
            graphics.init(ctx, _canvas.width, _canvas.height, _pageW, _pageH);
            graphics.m_oFontManager = g_fontManager;
            graphics.transform(1, 0, 0, 1, 0, 0);
            table.Recalculate_Page(0);
            table.Draw(0, graphics);
            var _styleD = new CAscTableStyle();
            _styleD.Type = 0;
            _styleD.Image = _canvas.toDataURL("image/png");
            _styleD.Id = i;
            _dst_styles.push(_styleD);
        }
        History.TurnOn();
        this.m_oWordControl.m_oApi.sync_InitEditorTableStyles(_dst_styles);
    };
    this.IsMobileVersion = function () {
        if (this.m_oWordControl.MobileTouchManager) {
            return true;
        }
        return false;
    };
    this.OnSelectEnd = function () {
        if (this.m_oWordControl && this.m_oWordControl.MobileTouchManager) {
            this.m_oWordControl.MobileTouchManager.CheckSelectEnd(false);
        }
    };
}
function CStyleImage(_name, _ind, _type, _uiPriority) {
    this.Name = _name;
    this.ThumbnailOffset = _ind;
    this.Type = _type;
    this.uiPriority = _uiPriority;
}
function CStylesPainter() {
    this.defaultStylesImage = "";
    this.defaultStyles = null;
    this.docStylesImage = "";
    this.docStyles = null;
    this.mergedStyles = null;
    this.STYLE_THUMBNAIL_WIDTH = 80;
    this.STYLE_THUMBNAIL_HEIGHT = 40;
    this.CurrentTranslate = null;
    this.GenerateStyles = function (_api, ds) {
        this.CurrentTranslate = _api.CurrentTranslate;
        this.GenerateDefaultStyles(_api, ds);
        this.GenerateDocumentStyles(_api);
        var _count_default = this.defaultStyles.length;
        var _count_doc = 0;
        if (null != this.docStyles) {
            _count_doc = this.docStyles.length;
        }
        var aPriorityStyles = [];
        var fAddToPriorityStyles = function (style) {
            var index = style.uiPriority;
            if (null == index) {
                index = 0;
            }
            var aSubArray = aPriorityStyles[index];
            if (null == aSubArray) {
                aSubArray = [];
                aPriorityStyles[index] = aSubArray;
            }
            aSubArray.push(style);
        };
        var _map_document = {};
        for (var i = 0; i < _count_doc; i++) {
            var style = this.docStyles[i];
            _map_document[style.Name] = 1;
            fAddToPriorityStyles(style);
        }
        for (var i = 0; i < _count_default; i++) {
            var style = this.defaultStyles[i];
            if (null == _map_document[style.Name]) {
                fAddToPriorityStyles(style);
            }
        }
        this.mergedStyles = [];
        for (var index in aPriorityStyles) {
            var aSubArray = aPriorityStyles[index];
            aSubArray.sort(function (a, b) {
                if (a.Name < b.Name) {
                    return -1;
                } else {
                    if (a.Name > b.Name) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            });
            for (var i = 0, length = aSubArray.length; i < length; ++i) {
                this.mergedStyles.push(aSubArray[i]);
            }
        }
        _api.sync_InitEditorStyles(this);
    };
    this.GenerateDefaultStyles = function (_api, ds) {
        var styles = ds;
        var _count = 0;
        for (var i in styles) {
            _count++;
        }
        var cur_index = 0;
        if (false) {
            this.defaultStylesImage = "data:image/png;base64,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";
            this.defaultStyles = [];
            for (var i in styles) {
                this.defaultStyles[cur_index] = new CStyleImage(styles[i].Name, cur_index, c_oAscStyleImage.Default);
                cur_index++;
            }
            return;
        }
        var _canvas = document.createElement("canvas");
        _canvas.width = this.STYLE_THUMBNAIL_WIDTH;
        _canvas.height = _count * this.STYLE_THUMBNAIL_HEIGHT;
        var ctx = _canvas.getContext("2d");
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, _canvas.width, _canvas.height);
        var graphics = new CGraphics();
        graphics.init(ctx, _canvas.width, _canvas.height, _canvas.width * g_dKoef_pix_to_mm, _canvas.height * g_dKoef_pix_to_mm);
        graphics.m_oFontManager = g_fontManager;
        this.defaultStyles = [];
        for (var i in styles) {
            var style = styles[i];
            if (true == style.qFormat) {
                this.drawStyle(graphics, style, cur_index);
                this.defaultStyles[cur_index] = new CStyleImage(style.Name, cur_index, c_oAscStyleImage.Default, style.uiPriority);
                cur_index++;
            }
        }
        this.defaultStylesImage = _canvas.toDataURL("image/png");
    };
    this.GenerateDocumentStyles = function (_api) {
        if (_api.WordControl.m_oLogicDocument == null) {
            return;
        }
        var __Styles = _api.WordControl.m_oLogicDocument.Get_Styles();
        var styles = __Styles.Style;
        if (styles == null) {
            return;
        }
        var _count = 0;
        for (var i in styles) {
            _count++;
        }
        if (0 == _count) {
            return;
        }
        var cur_index = 0;
        var _canvas = document.createElement("canvas");
        _canvas.width = this.STYLE_THUMBNAIL_WIDTH;
        _canvas.height = _count * this.STYLE_THUMBNAIL_HEIGHT;
        var ctx = _canvas.getContext("2d");
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, _canvas.width, _canvas.height);
        var graphics = new CGraphics();
        graphics.init(ctx, _canvas.width, _canvas.height, _canvas.width * g_dKoef_pix_to_mm, _canvas.height * g_dKoef_pix_to_mm);
        graphics.m_oFontManager = g_fontManager;
        this.docStyles = [];
        for (var i in styles) {
            var style = styles[i];
            if (true == style.qFormat) {
                var formalStyle = i.toLowerCase().replace(/\s/g, "");
                var res = formalStyle.match(/^heading([1-9][0-9]*)$/);
                var index = (res) ? res[1] - 1 : -1;
                this.drawStyle(graphics, __Styles.Get_Pr(i, styletype_Paragraph), cur_index);
                this.docStyles[cur_index] = new CStyleImage(style.Name, cur_index, c_oAscStyleImage.Document, style.uiPriority);
                if (style.Default) {
                    switch (style.Default) {
                    case 1:
                        break;
                    case 2:
                        this.docStyles[cur_index].Name = "No List";
                        break;
                    case 3:
                        this.docStyles[cur_index].Name = "Normal";
                        break;
                    case 4:
                        this.docStyles[cur_index].Name = "Normal Table";
                        break;
                    }
                } else {
                    if (index != -1) {
                        this.docStyles[cur_index].Name = "Heading ".concat(index + 1);
                    }
                }
                cur_index++;
            }
        }
        this.docStylesImage = _canvas.toDataURL("image/png");
    };
    this.drawStyle = function (graphics, style, index) {
        var font = {
            FontFamily: {
                Name: "Times New Roman",
                Index: -1
            },
            Color: {
                r: 0,
                g: 0,
                b: 0
            },
            Bold: false,
            Italic: false,
            FontSize: 10
        };
        var textPr = style.TextPr;
        if (textPr.FontFamily != undefined) {
            font.FontFamily.Name = textPr.FontFamily.Name;
            font.FontFamily.Index = textPr.FontFamily.Index;
        }
        if (textPr.Bold != undefined) {
            font.Bold = textPr.Bold;
        }
        if (textPr.Italic != undefined) {
            font.Italic = textPr.Italic;
        }
        if (textPr.FontSize != undefined) {
            font.FontSize = textPr.FontSize;
        }
        graphics.SetFont(font);
        if (textPr.Color == undefined) {
            graphics.b_color1(0, 0, 0, 255);
        } else {
            graphics.b_color1(textPr.Color.r, textPr.Color.g, textPr.Color.b, 255);
        }
        var y = index * g_dKoef_pix_to_mm * this.STYLE_THUMBNAIL_HEIGHT;
        var b = (index + 1) * g_dKoef_pix_to_mm * this.STYLE_THUMBNAIL_HEIGHT;
        var w = g_dKoef_mm_to_pix * this.STYLE_THUMBNAIL_WIDTH;
        graphics.transform(1, 0, 0, 1, 0, 0);
        graphics.save();
        graphics._s();
        graphics._m(-0.5, y);
        graphics._l(w, y);
        graphics._l(w, b);
        graphics._l(0, b);
        graphics._z();
        graphics.clip();
        graphics.t(this.CurrentTranslate.StylesText, 0.5, (y + b) / 2);
        var ctx = graphics.m_oContext;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = "#E8E8E8";
        var _b = (index + 1) * this.STYLE_THUMBNAIL_HEIGHT - 1.5;
        var _x = 2;
        var _w = this.STYLE_THUMBNAIL_WIDTH - 4;
        var _h = parseInt(this.STYLE_THUMBNAIL_HEIGHT / 3);
        ctx.beginPath();
        ctx.moveTo(_x, _b - _h);
        ctx.lineTo(_x + _w, _b - _h);
        ctx.lineTo(_x + _w, _b);
        ctx.lineTo(_x, _b);
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#D8D8D8";
        ctx.beginPath();
        ctx.rect(0.5, index * this.STYLE_THUMBNAIL_HEIGHT + 0.5, this.STYLE_THUMBNAIL_WIDTH - 1, this.STYLE_THUMBNAIL_HEIGHT - 1);
        ctx.stroke();
        graphics.restore();
    };
}