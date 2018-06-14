# Muxer
Tmux management tool

Muxer is a CLI tool that extend `tmuxp` functionality to match my needs. I usually use tmux in combination with vim to create powerfull IDE. While vim has it's own terminal emulator but I prefer using tmux because it's faster. I need tmux and vim to be integrated because I want to automated my workflow so hopefully I can start working faster. Before you use this tool you must export `MUXER_HOME` in your shell configruation file (.bashrc, .zshrc) to tell muxer where your home directory for all you project.

```
# ~/.zshrc

export MUXER_HOME = ~/dev
```

## Usage

**muxer list**

This command will show you all avaliable workspace directory by using this it'll be easier which directory that has been configure.

**muxer create \[options\] \<target\>**

Target will be the name of workspace directory that you want to have inside home directory. It'll only create new directory when targeted directory is not available. The target also will become tmux session name to make it consistent and easy to remember. By default after directory and config file is create it'll show the config file so you can easily modify your need. Please refer to [`tmuxp` documentation](https://tmuxp.git-pull.com/en/latest/examples.html) for more information about this config file. To skip config edit you just need add `-f` on the option.

**muxer edit \<target\>**

Edit target workspace configuration. Make sure you have export `EDITOR` from you shell configuration file otherwise it won't work as expected.

**muxer remove \[options\] \<target\>**

Remove terget workspace directory and configuration but if you only want to remove the configuration add `--keep-dir` options.

**muxer active**

This command will show all active workspace. While you can use `tmux list` but I find the output bit wierd and this command is attempt to make it better.

**muxer open \<target...\>**

Open tmux session based on the given target and you may open multiple session at once using only one command. It's very convinient.

**muxer close \[options\] \[target...\]**

In this command target is optional, in that case all session will be close if you add `--all` options. You may close multiple session at once using this command.
