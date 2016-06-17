﻿<%@ Page Title="ONLYOFFICE™" Language="C#" Inherits="System.Web.Mvc.ViewPage" %>

<%@ Import Namespace="System.Web.Configuration" %>
<%@ Import Namespace="OnlineEditorsExampleMVC.Helpers" %>

<!DOCTYPE html>

<html lang="en">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width" />
    <title>ONLYOFFICE™</title>

    <link href="<%: Url.Content("~/favicon.ico") %>" rel="shortcut icon" type="image/x-icon" />

    <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Open+Sans:900,800,700,600,500,400,300&subset=latin,cyrillic-ext,cyrillic,latin-ext" />

    <%: Styles.Render("~/Content/css") %>
</head>
<body>
    <div class="top-panel"></div>
    <div class="main-panel">
        <span class="portal-name">ONLYOFFICE™ Online Editors</span>
        <br />
        <br />
        <span class="portal-descr">Get started with a demo-sample of ONLYOFFICE™ Online Editors, the first html5-based editors. You may upload your own documents for testing using the "Choose file" button and selecting the necessary files on your PC.</span>

        <div class="file-upload button gray">
            <span>Choose file</span>
            <input type="file" id="fileupload" name="files[]" data-url="<%= Url.Content("~/webeditor.ashx?type=upload") %>" />
        </div>
        <label class="save-original">
            <input type="checkbox" id="checkOriginalFormat" />Save document in original format
        </label>
        <span class="question"></span>
        <br />
        <br />
        <br />
        <span class="try-descr">You are also enabled to view and edit documents pre-uploaded to the portal.</span>

        <ul class="try-editor-list">
            <li><%= Html.ActionLink("Sample Document", "sample", "Home", new { fileExt = "docx" }, new { @class = "try-editor document", target = "_blank" })%></li>
            <li><%= Html.ActionLink("Sample Spreadsheet", "sample", "Home", new { fileExt = "xlsx" }, new { @class = "try-editor spreadsheet", target = "_blank" })%></li>
            <li><%= Html.ActionLink("Sample Presentation", "sample", "Home", new { fileExt = "pptx" }, new { @class = "try-editor presentation", target = "_blank" })%></li>
        </ul>

        <br />
        <br />
        <br />
        <div class="help-block">
            <span>Want to learn how it works?</span>
            <br />
            Read the editor <a href="http://api.onlyoffice.com/editors/howitworks">API Documentation</a>
        </div>
        <br />
        <br />
        <br />
        <div class="help-block">
            <span>Any questions?</span>
            <br />
            Please, <a href="mailto:sales@onlyoffice.com">submit your request</a> and we'll help you shortly.
        </div>
    </div>

    <div id="hint">
        <div class="corner"></div>
        If you check this option the file will be saved both in the original and converted into Office Open XML format for faster viewing and editing. In other case the document will be overwritten by its copy in Office Open XML format.
    </div>

    <div id="mainProgress">
        <div id="uploadSteps">
            <span id="step1" class="step">1. Loading the file</span>
            <span class="step-descr">The file loading process will take some time depending on the file size, presence or absence of additional elements in it (macros, etc.) and the connection speed.</span>
            <br />
            <span id="step2" class="step">2. File conversion</span>
            <span class="step-descr">The file is being converted into Office Open XML format for the document faster viewing and editing.</span>
            <br />
            <span id="step3" class="step">3. Loading editor scripts</span>
            <span class="step-descr">The scripts for the editor are loaded only once and are will be cached on your computer in future. It might take some time depending on the connection speed.</span>
            <input type="hidden" name="hiddenFileName" id="hiddenFileName" />
            <br />
            <br />
            <span class="progress-descr">Please note, that the speed of all operations greatly depends on the server and the client locations. In case they differ or are located in differernt countries/continents, there might be lack of speed and greater wait time. The best results are achieved when the server and client computers are located in one and the same place (city).</span>
            <br />
            <br />
            <div class="error-message">
                <span></span>
                <br />
                Please select another file and try again. If you have questions please <a href="mailto:sales@onlyoffice.com">contact us.</a>
            </div>
        </div>
        <iframe id="embeddedView" src="" height="345px" width="600px" frameborder="0" scrolling="no" allowtransparency></iframe>
        <br />
        <div id="beginEmbedded" class="button disable">Embedded view</div>
        <div id="beginView" class="button disable">View</div>
        <div id="beginEdit" class="button disable">Edit</div>
        <div id="cancelEdit" class="button gray">Cancel</div>
    </div>

    <span id="loadScripts" data-docs="<%= WebConfigurationManager.AppSettings["files.docservice.url.preloader"] %>"></span>

    <div class="bottom-panel">&copy; Ascensio System SIA <%= DateTime.Now.Year.ToString() %>. All rights reserved.</div>

    <%: Scripts.Render("~/bundles/jquery", "~/bundles/scripts") %>
    
    <script language="javascript" type="text/javascript">
        var ConverExtList = '<%= string.Join(",", DocManagerHelper.ConvertExts.ToArray()) %>';
        var EditedExtList = '<%= string.Join(",", DocManagerHelper.EditedExts.ToArray()) %>';
        var UrlConverter = '<%= Url.Content("~/webeditor.ashx?type=convert") %>';
        var UrlEditor = '<%= Url.Action("editor", "Home") %>';
    </script>
</body>
</html>
