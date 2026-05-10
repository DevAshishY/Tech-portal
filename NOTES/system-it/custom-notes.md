# Linux / Dev Tips

---

## 1. Fix Watcher Limit (inotify)

When you get `ENOSPC: System limit for number of file watchers reached` error:

```bash
# Increase max watchers and instances
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
echo fs.inotify.max_user_instances=512 | sudo tee -a /etc/sysctl.conf

# Apply changes
sudo sysctl -p
```