// This is a utility to build & copy assets to other projects.

// Usage:
// go run bump.go roller
// go run bump.go etcd
// Assumes the etcd and roller projects are installed under the GOPATH/src.
package main

import (
	"fmt"
	"os"
	"os/exec"
	"path"
)

var projectRootDir string
var GOPATH = os.Getenv("GOPATH")

// Path where grunt build assets are placed.
const DIST_PATH = "./dist/"

type TargetConfig struct {
	LibDir string
}

// TODO: move to config file
var coreosConfigs = map[string]TargetConfig{
	"example": TargetConfig{
		LibDir: "",
	},
	"roller": TargetConfig{
		LibDir: path.Join(GOPATH, "src/github.com/coreos-inc/roller/cp/app/lib/coreos-web"),
	},
	"etcd": TargetConfig{
		LibDir: path.Join(GOPATH, "src/github.com/coreos/etcd/mod/dashboard/app/coreos-web"),
	},
	"account": TargetConfig{
		LibDir: path.Join(GOPATH, "src/github.com/coreos-inc/account/frontend/public/lib/coreos-web"),
	},
}

// Execute the grunt command for the library build.
func grunt() {
	cmd := exec.Command("grunt")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Run()
}

// Copy build assets to destination dir.
func copyDist(c TargetConfig) {
	if c.LibDir == "" {
		return
	}
	cmd := exec.Command("cp", "-r", DIST_PATH, c.LibDir)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Run()
}

// Run the build and copy etc.
func build(c TargetConfig) {
	fmt.Println("Running grunt...")
	grunt()
	fmt.Println("grunt complete")
	fmt.Printf("Copying assets from %s to %s...", DIST_PATH, c.LibDir)
	copyDist(c)
	fmt.Printf("done\n")
	fmt.Println("Build success!")
}

func main() {
	// Optionally accepts env vars to specify paths so editing struct is not necessary.
	if os.Getenv("COREOSWEB_DIST_PATH") != "" && os.Getenv("COREOSWEB_DIST_LIB_DIR") != "" {
		config := TargetConfig{
			LibDir: os.Getenv("COREOSWEB_LIB_DIR"),
		}
		fmt.Println("Building custom target.")
		build(config)
	} else {
		args := os.Args[1:]
		if len(args) == 0 {
			fmt.Println("Usage: go run bump.go <project-name>")
			return
		}
		target := args[0]
		if _, ok := coreosConfigs[target]; !ok {
			panic("target doesn't exist: " + target)
		}
		fmt.Printf("building target: %s\n", target)
		build(coreosConfigs[target])
	}
}
