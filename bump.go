// This is a utility to do 2 things.
// 1. Update the static path location for css builds per project.
// 2. Copy the compiled assets to their corresponding destination.

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
	"text/template"
)

var scssTemplate *template.Template
var projectRootDir string
var GOPATH = os.Getenv("GOPATH")

// Output location of the template once it's compiled.
const SCSS_OUTPUT_FILE = "./src/sass/_path-config.scss"

// Path where grunt build assets are placed.
const DIST_PATH = "./dist/"

type TargetConfig struct {
	DistPath string
	LibDir   string
}

var coreosConfigs = map[string]TargetConfig{
	"example": TargetConfig{
		DistPath: "/../dist/",
		LibDir:   "",
	},
	"roller": TargetConfig{
		DistPath: "/cp/static/coreos-web/",
		LibDir:   path.Join(GOPATH, "src/github.com/coreos-inc/roller/cp/app/coreos-web"),
	},
	"etcd": TargetConfig{
		DistPath: "/mod/dashboard/static/coreos-web/",
		LibDir:   path.Join(GOPATH, "src/github.com/coreos/etcd/mod/dashboard/app/coreos-web"),
	},
}

// Execute the grunt command for the library build.
func grunt() {
	cmd := exec.Command("grunt")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Run()
}

// Execute the scss paths template with the appropriate args.
func execTemplate(c TargetConfig) {
	// Create the output file.
	f, err := os.Create(SCSS_OUTPUT_FILE)
	if err != nil {
		fmt.Println("error creating destination file.")
	}
	defer f.Close()

	// Write processed template to output file.
	scssTemplate.Execute(f, c)
	if err != nil {
		fmt.Println("error executing template")
	}
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
	fmt.Printf("Executing template...")
	execTemplate(c)
	fmt.Printf("done\n")
	fmt.Println("Running grunt...")
	grunt()
	fmt.Println("grunt complete")
	fmt.Printf("Copying assets from %s to %s...", DIST_PATH, c.LibDir)
	copyDist(c)
	fmt.Printf("done\n")
	fmt.Println("Build success!")
}

func main() {
	// Read path-config template.
	var err error
	scssTemplate, err = template.ParseFiles("path-config.tpl.scss")
	if err != nil {
		fmt.Println("template file not found")
	}

	// Optionally accepts env vars to specify paths so editing struct is not necessary.
	if os.Getenv("COREOSWEB_DIST_PATH") != "" && os.Getenv("COREOSWEB_DIST_LIB_DIR") != "" {
		config := TargetConfig{
			DistPath: os.Getenv("COREOSWEB_DIST_PATH"),
			LibDir:   os.Getenv("COREOSWEB_LIB_DIR"),
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
