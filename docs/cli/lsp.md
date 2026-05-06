---
title: codelens lsp
description: Start the codelens Language Server Protocol server on stdio for editor integration.
---

# codelens lsp

```
codelens lsp
```

Starts a Language Server Protocol (LSP) server on stdin/stdout. Editors and LSP clients connect to the server and receive `publishDiagnostics` notifications when files are opened or saved.

## Protocol

The server is hand-rolled (no `tower-lsp` dependency) and implements a minimum-viable LSP surface:

| Message                           | Behaviour                                                                 |
| --------------------------------- | ------------------------------------------------------------------------- |
| `initialize`                      | Returns server capabilities.                                              |
| `initialized`                     | Acknowledged; no action.                                                  |
| `textDocument/didOpen`            | Runs `Engine::analyze_path` against the file URI; publishes diagnostics.  |
| `textDocument/didSave`            | Re-runs analysis; publishes updated diagnostics.                          |
| `textDocument/didChange`          | Re-runs analysis on the changed file; publishes updated diagnostics.      |
| `shutdown` / `exit`               | Graceful shutdown.                                                        |

JSON-RPC framing uses standard `Content-Length` headers.

## Severity mapping

codelens finding severities map to LSP diagnostic severities:

| codelens severity | LSP severity    |
| ----------------- | --------------- |
| `critical`        | Error (1)       |
| `high`            | Error (1)       |
| `medium`          | Warning (2)     |
| `low`             | Information (3) |
| `info`            | Hint (4)        |

## Editor setup

The server reads from stdin and writes to stdout — configure your editor's LSP client to launch `codelens lsp` as the server command.

### Neovim (via nvim-lspconfig)

```lua
vim.api.nvim_create_autocmd("FileType", {
  pattern = { "rust", "python", "javascript", "typescript" },
  callback = function()
    vim.lsp.start({
      name = "codelens",
      cmd = { "codelens", "lsp" },
      root_dir = vim.fs.dirname(
        vim.fs.find({ "codelens.toml", "Cargo.toml", "pyproject.toml" }, { upward = true })[1]
      ),
    })
  end,
})
```

### VS Code

Use the generic [LSP client extension](https://marketplace.visualstudio.com/items?itemName=llvm-vs-code-extensions.vscode-clangd) or write a minimal extension that spawns `codelens lsp`.

## Known limitations

- Each save triggers a full re-analysis of the file. The incremental cache from the CLI is not wired in; LSP runs are cold engine runs.
- No workspace symbols, no code actions, no hover. Minimum-viable diagnostics only.

## See also

- [LSP integration guide](/integrations/lsp)
- [`codelens watch`](/cli/watch)
