{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = {self, nixpkgs}: let
    pkgs = nixpkgs.legacyPackages."x86_64-linux";
  in {
    devShells."x86_64-linux".default = pkgs.mkShell {
      buildInputs = with pkgs; [
	nodejs_24
	pnpm

      ];
      env.RUST_SRC_PATH = "${pkgs.rust.packages.stable.rustPlatform.rustLibSrc}";
    };
  };
}
